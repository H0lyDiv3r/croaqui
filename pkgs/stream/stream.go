package stream

import (
	"context"
	"net"
	"sync"

	"github.com/pion/ice/v4"
	"github.com/pion/stun/v4"
)

var stunServers = []string{
	"stun:stun.cloudflare.com:3478",
	"stun:stun.l.google.com:19302",
	"stun:stun1.l.google.com:19302",
}

type LocalSessionInfo struct {
	Ufrag      string   `json:"ufrag"`
	Pwd        string   `json:"pwd"`
	Candidates []string `json:"candidates"`
}

type Peer struct {
	PeerId int
	Agent  *ice.Agent
	Conn   *ice.Conn
}

type Stream struct {
	ctx     context.Context
	IsHost  bool
	Session LocalSessionInfo
	Peers   []*Peer
}

func NewStream() *Stream {
	return &Stream{}
}

func (s *Stream) StartUp(ctx context.Context) {
	s.ctx = ctx
}

func (s *Stream) OpenConnection() {

	var stunUris []*stun.URI
	for _, rawURI := range stunServers {
		uri, err := stun.ParseURI(rawURI)
		if err != nil {
			// TODO:handle error
		}
		stunUris = append(stunUris, uri)
	}

	agent, err := ice.NewAgentWithOptions(
		ice.WithUrls(stunUris),
		ice.WithNetworkTypes([]ice.NetworkType{ice.NetworkTypeUDP4}),
		ice.WithIncludeLoopback(),
		ice.WithIPFilter(func(ip net.IP) bool {
			//ipFilterGoesHere
			return true
		}),
	)

	if err != nil {
		//handle error
	}

	// new Peers
	_ = Peer{
		PeerId: len(s.Peers) + 1,
		Agent:  agent,
	}

	err = agent.OnConnectionStateChange(func(s ice.ConnectionState) {
		//log connection state
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

	s.Session = LocalSessionInfo{
		Ufrag:      ufrag,
		Pwd:        pwd,
		Candidates: candidates,
	}
}
