package stream

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net"
	"strconv"
	"sync"
	"time"

	"github.com/H0lyDiv3r/croaqui/pkgs/events"
	"github.com/pion/ice/v4"
	"github.com/pion/sctp"
	"github.com/pion/stun/v4"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func (s *Stream) GetStatus() ConnectionStatus {
	return s.Status
}

func (s *Stream) setStatus(status ConnectionStatus) {
	s.Status = status
	if s.ctx != nil {
		runtime.EventsEmit(s.ctx, events.StreamStatusChanged, string(status))
	}
}

func (s *Stream) Connect(isHost bool, roomId string) {
	s.IsHost = isHost
	s.setStatus(StatusConnecting)

	s.Handshake = NewHandshake("http://172.17.0.1:9090")

	sessionEncoded, err := s.CreatePeer()

	if err != nil {
		s.setStatus(StatusError)
		return
	}

	if s.IsHost {
		roomKey := s.Handshake.GenerateRoomKey(12)
		fmt.Println("this is the room key", s.Handshake.RoomKey, roomKey)
		//send roomKey out into the world
		runtime.EventsEmit(s.ctx, events.StreamRoomKeyGenerated, roomKey)
		room, err := s.Handshake.CreateRoom(sessionEncoded)
		if err != nil {
			s.setStatus(StatusError)
			return
		}

		s.ConnectPeer(room.PeerSeesion, s.IsHost)
	} else {

		hostRemoteSession, err := s.Handshake.JoinRoom(roomId)
		if err != nil {
			s.setStatus(StatusError)
			return
		}

		s.ConnectPeer(hostRemoteSession, s.IsHost)

		err = s.Handshake.AcceptConnection(sessionEncoded)
		if err != nil {
			s.setStatus(StatusError)
			return
		}
	}
}

func (s *Stream) CreatePeer() (string, error) {

	var stunURIs []*stun.URI
	for _, rawURI := range stunServers {
		uri, err := stun.ParseURI(rawURI)
		if err != nil {
			return "", fmt.Errorf("failed to parse stun uris %v", err)
		}
		stunURIs = append(stunURIs, uri)
	}

	if turnServer != "" {
		turnURI, err := stun.ParseURI("turn:" + turnServer + "?transport=udp")
		if err == nil {
			turnURI.Username = turnUser
			turnURI.Password = turnPass
			stunURIs = append(stunURIs, turnURI)
			//handle
			fmt.Printf("📦 Configured TURN Relay: %s (user: %s)\n", turnServer, turnUser)
		} else {
			return "", fmt.Errorf("failed to configure turn servers %v: ", err)
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
		return "", fmt.Errorf("failed to create an agent %v: ", err)
	}

	peerId := strconv.Itoa(len(s.Peers) + 1)
	// new Peers
	p := Peer{
		Id:    peerId,
		Agent: agent,
	}

	s.Peers[peerId] = &p
	err = agent.OnConnectionStateChange(func(state ice.ConnectionState) {
		//state change
		if s.ctx != nil {
			runtime.EventsEmit(s.ctx, "stream:state", state.String())
		}
	})

	if err != nil {
		return "", fmt.Errorf("failed to set connection state handler %v", err)
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
		return "", fmt.Errorf("failed to set candidate handler %v", err)
	}

	agent.GatherCandidates()
	<-done

	ufrag, pwd, err := agent.GetLocalUserCredentials()

	if err != nil {
		return "", fmt.Errorf("failed to get local user credentials %v", err)
	}

	// storing PeerId here not because the remote peer needs it.
	// it is stored his because the local peer needs to know which peer owns the conn and remote session
	// everytime create peer is called the peerId will be incremented and peer id will have different ids
	// encoding and sending it to peer for now but it is not to be used by the remote.
	s.Session = SessionCreds{
		PeerId:     peerId,
		Ufrag:      ufrag,
		Pwd:        pwd,
		Candidates: candidates,
	}

	localEncoded, err := encodeSession(s.Session)
	if err != nil {
		return "", fmt.Errorf("failed to encode session %v", err)
	}

	return localEncoded, nil

}

func (s *Stream) ConnectPeer(sessionKey string, isHost bool) error {

	remote, err := decodeSession(sessionKey)
	if err != nil {
		// handle error
		return fmt.Errorf("connect peer: failed to decode session $v: ", err)
	}

	var peer *Peer

	peer = s.Peers[s.Session.PeerId]

	if peer == nil {
		return fmt.Errorf("connecting peer: peer with the id of %s not found: %v", s.Session.PeerId)
	}

	agent := peer.Agent
	peer.RemoteSession = remote

	for _, candStr := range remote.Candidates {
		c, err := ice.UnmarshalCandidate(candStr)
		if err != nil {
			//log
			continue
		}
		if err := agent.AddRemoteCandidate(c); err != nil {
			//log
			// println("[Stream ICE] Error adding remote candidate:", err.Error())
		}
	}

	if isHost {
		go func() {
			ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
			defer cancel()
			//log
			conn, err := agent.Dial(ctx, remote.Ufrag, remote.Pwd)
			if err != nil {
				s.setStatus(StatusError)
				if s.ctx != nil {
					runtime.EventsEmit(s.ctx, "stream:log", "Host Dial failed: "+err.Error())
				}
			} else {
				s.setStatus(StatusConnected)
				pair, pErr := agent.GetSelectedCandidatePair()
				connMsg := "Host connected successfully!"
				if pErr == nil && pair != nil {
					connMsg = fmt.Sprintf("Host connected via %s (%s <-> %s)!", pair.Local.Type().String(), pair.Local.Address(), pair.Remote.Address())
				}
				if s.ctx != nil {
					runtime.EventsEmit(s.ctx, "stream:log", connMsg)
				}
			}
			peer.Conn = conn
			assoc, err := sctp.ServerWithOptions(sctp.WithNetConn(peer.Conn))
			peer.SCTP = assoc
			audioStream, err := assoc.OpenStream(0, sctp.PayloadTypeWebRTCBinary)
			peer.AudioStream = audioStream

		}()
	} else {
		go func() {
			ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
			defer cancel()
			conn, err := agent.Accept(ctx, remote.Ufrag, remote.Pwd)
			if err != nil {
				s.setStatus(StatusError)
				if s.ctx != nil {
					runtime.EventsEmit(s.ctx, "stream:log", "Client Accept failed: "+err.Error())
				}
			} else {
				s.setStatus(StatusConnected)
				pair, pErr := agent.GetSelectedCandidatePair()
				connMsg := "Client connected successfully!"
				if pErr == nil && pair != nil {
					connMsg = fmt.Sprintf("Client connected via %s (%s <-> %s)!", pair.Local.Type().String(), pair.Local.Address(), pair.Remote.Address())
				}
				if s.ctx != nil {
					runtime.EventsEmit(s.ctx, "stream:log", connMsg)
				}
			}
			peer.Conn = conn
			assoc, err := sctp.ClientWithOptions(sctp.WithNetConn(peer.Conn))
			peer.SCTP = assoc

			audioStream, err := assoc.OpenStream(0, sctp.PayloadTypeWebRTCBinary)
			// controlStream, err := assoc.OpenStream(1, sctp.PayloadTypeWebRTCBinary)
			peer.AudioStream = audioStream

		}()
	}

	return nil
}

// to be removed. its only here for test ui
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
