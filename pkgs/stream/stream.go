package stream

import (
	"context"

	"github.com/H0lyDiv3r/croaqui/pkgs/player"
	"github.com/pion/ice/v4"
	"github.com/pion/sctp"
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
	SCTP          *sctp.Association
	AudioStream   *sctp.Stream
	ControlStream *sctp.Stream
}

type ConnectionStatus string

const (
	StatusDisconnected ConnectionStatus = "disconnected"
	StatusConnecting   ConnectionStatus = "connecting"
	StatusConnected    ConnectionStatus = "connected"
	StatusError        ConnectionStatus = "error"
)

type Stream struct {
	ctx       context.Context
	Status    ConnectionStatus
	Player    *player.Player
	IsHost    bool
	Session   SessionCreds
	Peers     map[string]*Peer
	Handshake *Handshake
}

func NewStream() *Stream {
	return &Stream{
		Status: StatusDisconnected,
		Peers:  make(map[string]*Peer),
	}
}

func (s *Stream) StartUp(ctx context.Context, player *player.Player) {
	s.ctx = ctx
	s.Player = player
}
