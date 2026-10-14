package stream

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net"
	"net/http"
	"strconv"
	"sync"
	"time"

	"github.com/pion/ice/v4"
	"github.com/pion/stun/v4"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

var stunServers = []string{
	"stun:stun.cloudflare.com:3478",
	"stun:stun.l.google.com:19302",
	"stun:stun1.l.google.com:19302",
}

var turnServer = "172.17.0.1:3478"
var turnUser = "pionuser"
var turnPass = "supersecretpass123"

type SessionCreds struct {
	PeerId     string   `json:"peerId"`
	Ufrag      string   `json:"ufrag"`
	Pwd        string   `json:"pwd"`
	Candidates []string `json:"candidates"`
}

type Peer struct {
	Id            string
	Agent         *ice.Agent
	Conn          *ice.Conn
	RemoteSession SessionCreds
}

type Stream struct {
	ctx       context.Context
	IsHost    bool
	Session   SessionCreds
	Peers     map[string]*Peer
	Handshake *Handshake
}

func NewStream() *Stream {
	return &Stream{
		Peers: make(map[string]*Peer),
	}
}

func (s *Stream) StartUp(ctx context.Context) {
	s.ctx = ctx
}

func (s *Stream) Connect(isHost bool, roomId string) {
	s.IsHost = isHost

	s.Handshake = NewHandshake("http://192.168.1.26:9090")

	sessionEncoded := s.CreatePeer()

	if s.IsHost {
		roomKey := s.Handshake.GenerateRoomKey(12)
		fmt.Println("this is the room key", s.Handshake.RoomKey, roomKey)
		//send roomKey out into the world
		room, err := s.Handshake.CreateRoom(sessionEncoded)
		if err != nil {
			return
		}

		s.ConnectPeer(room.PeerSeesion, s.IsHost)
	} else {

		hostRemoteSession, err := s.Handshake.JoinRoom(roomId)
		if err != nil {
			return
		}

		s.ConnectPeer(hostRemoteSession, s.IsHost)

		err = s.Handshake.AcceptConnection(sessionEncoded)
		if err != nil {
			return
		}
	}
}

func (s *Stream) CreatePeer() string {

	var stunURIs []*stun.URI
	for _, rawURI := range stunServers {
		uri, err := stun.ParseURI(rawURI)
		if err != nil {
			// TODO:handle error
		}
		stunURIs = append(stunURIs, uri)
	}

	if turnServer != "" {
		turnURI, err := stun.ParseURI("turn:" + turnServer + "?transport=udp")
		if err == nil {
			turnURI.Username = turnUser
			turnURI.Password = turnPass
			stunURIs = append(stunURIs, turnURI)
			fmt.Printf("📦 Configured TURN Relay: %s (user: %s)\n", turnServer, turnUser)
		} else {
			fmt.Printf("⚠️  Failed to parse TURN server URI: %v\n", err)
		}
	}

	agent, err := ice.NewAgentWithOptions(
		ice.WithUrls(stunURIs),
		ice.WithNetworkTypes([]ice.NetworkType{ice.NetworkTypeUDP4}),
		ice.WithIncludeLoopback(),
		ice.WithIPFilter(func(ip net.IP) bool {
			if ip4 := ip.To4(); ip4 != nil {
				// Allow Coturn relay IP explicitly
				if ip4[0] == 172 && ip4[1] == 17 && ip4[2] == 0 && ip4[3] == 1 {
					return true
				}
				// Filter out other Docker bridge subnets (172.17.0.0/16 to 172.31.255.255)
				if ip4[0] == 172 && ip4[1] >= 17 && ip4[1] <= 31 {
					return false
				}
				// Filter out libvirt default bridge (192.168.122.0/24)
				if ip4[0] == 192 && ip4[1] == 168 && ip4[2] == 122 {
					return false
				}
			}
			return true
		}),
	)

	if err != nil {
		//handle error
	}

	peerId := strconv.Itoa(len(s.Peers) + 1)
	// new Peers
	p := Peer{
		Id:    peerId,
		Agent: agent,
	}

	s.Peers[peerId] = &p
	err = agent.OnConnectionStateChange(func(state ice.ConnectionState) {
		println("[Stream ICE] Connection state changed:", state.String())
		if s.ctx != nil {
			runtime.EventsEmit(s.ctx, "stream:state", state.String())
		}
	})

	if err != nil {
		//handle error
	}

	// gathering candidates
	var candidates []string
	var mu sync.Mutex
	done := make(chan struct{})

	err = agent.OnCandidate(func(c ice.Candidate) {
		if c == nil {
			close(done)
			return
		}
		mu.Lock()
		candidates = append(candidates, c.Marshal())
		mu.Unlock()
	})

	if err != nil {
		// handle error
	}

	agent.GatherCandidates()
	<-done

	ufrag, pwd, err := agent.GetLocalUserCredentials()

	if err != nil {
		//handle error
	}

	s.Session = SessionCreds{
		PeerId:     peerId,
		Ufrag:      ufrag,
		Pwd:        pwd,
		Candidates: candidates,
	}

	localEncoded, err := encodeSession(s.Session)
	if err != nil {
		//handle error
	}

	fmt.Println("this is the local encoded", s.Session.Ufrag)

	return localEncoded

}

func (s *Stream) ConnectPeer(sessionKey string, isHost bool) SessionCreds {

	remote, err := decodeSession(sessionKey)
	if err != nil {
		// handle error
	}

	var peer *Peer
	if isHost {
		peer = s.Peers[remote.PeerId]
		if peer == nil {
			peer = s.Peers[s.Session.PeerId]
		}
	} else {
		peer = s.Peers[s.Session.PeerId]
		// Sync client's session to match host's peer ID
		s.Session.PeerId = remote.PeerId
	}

	if peer == nil {
		println("[Stream] Error: peer not found for ID:", remote.PeerId)
		return s.Session
	}

	agent := peer.Agent
	peer.RemoteSession = remote

	for _, candStr := range remote.Candidates {
		c, err := ice.UnmarshalCandidate(candStr)
		if err != nil {
			continue
		}
		if err := agent.AddRemoteCandidate(c); err != nil {
			println("[Stream ICE] Error adding remote candidate:", err.Error())
		}
	}

	if isHost {
		go func() {
			ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
			defer cancel()
			println("[Stream ICE] Host dialing remote peer...")
			conn, err := agent.Dial(ctx, remote.Ufrag, remote.Pwd)
			if err != nil {
				println("[Stream ICE] Host Dial failed:", err.Error())
				if s.ctx != nil {
					runtime.EventsEmit(s.ctx, "stream:log", "Host Dial failed: "+err.Error())
				}
			} else {
				pair, pErr := agent.GetSelectedCandidatePair()
				connMsg := "Host connected successfully!"
				if pErr == nil && pair != nil {
					connMsg = fmt.Sprintf("Host connected via %s (%s <-> %s)!", pair.Local.Type().String(), pair.Local.Address(), pair.Remote.Address())
				}
				println("[Stream ICE]", connMsg)
				if s.ctx != nil {
					runtime.EventsEmit(s.ctx, "stream:log", connMsg)
				}
			}
			peer.Conn = conn
		}()
	} else {
		go func() {
			ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
			defer cancel()
			println("[Stream ICE] Client waiting in Accept...")
			conn, err := agent.Accept(ctx, remote.Ufrag, remote.Pwd)
			if err != nil {
				println("[Stream ICE] Client Accept failed:", err.Error())
				if s.ctx != nil {
					runtime.EventsEmit(s.ctx, "stream:log", "Client Accept failed: "+err.Error())
				}
			} else {
				pair, pErr := agent.GetSelectedCandidatePair()
				connMsg := "Client connected successfully!"
				if pErr == nil && pair != nil {
					connMsg = fmt.Sprintf("Client connected via %s (%s <-> %s)!", pair.Local.Type().String(), pair.Local.Address(), pair.Remote.Address())
				}
				println("[Stream ICE]", connMsg)
				if s.ctx != nil {
					runtime.EventsEmit(s.ctx, "stream:log", connMsg)
				}
			}
			peer.Conn = conn
		}()
	}

	return s.Session
}

func (s *Stream) EncodeSession(session SessionCreds) string {
	res, _ := encodeSession(session)
	return res
}

func encodeSession(s SessionCreds) (string, error) {
	b, err := json.Marshal(s)
	if err != nil {
		return "", err
	}
	return base64.StdEncoding.EncodeToString(b), nil
}

func decodeSession(s string) (SessionCreds, error) {
	var info SessionCreds
	b, err := base64.StdEncoding.DecodeString(s)
	if err != nil {
		return info, err
	}
	err = json.Unmarshal(b, &info)
	return info, err
}

func queryHandshake(url, offer, room string) (string, error) {

	var b Offer

	client := &http.Client{
		Timeout: 60 * time.Second,
	}

	data, err := json.Marshal(map[string]string{
		"offer": offer,
	})

	if err != nil {
		//handle
		return "", fmt.Errorf("failed to send prepare body")
	}

	req, err := http.NewRequestWithContext(
		context.Background(),
		"POST",
		url,
		bytes.NewReader(data),
	)

	param := req.URL.Query()

	req.Header.Set("Content-Type", "application/json")
	param.Add("room", room)
	req.URL.RawQuery = param.Encode()

	res, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("failed to send request")
	}

	defer res.Body.Close()

	if err := json.NewDecoder(res.Body).Decode(&b); err != nil {
		return "", nil
	}

	return b.Offer, nil
}

func createRoomKey() string {
	return "test"
}
