package stream

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"net/url"
	"time"
)

const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"

type Offer struct {
	Offer string `json:"offer"`
}

type Handshake struct {
	BaseURL string
	RoomKey string
}

type CreateRoomResponse struct {
	PeerSeesion string `json:"peerSession"`
	RoomKey     string `json:"roomKey"`
}

func NewHandshake(url string) *Handshake {
	return &Handshake{
		BaseURL: url,
	}
}

func (h *Handshake) GenerateRoomKey(length int) string {

	bytes := make([]byte, length)
	for i := range bytes {
		bytes[i] = charset[rand.Intn(len(charset))]
	}

	h.RoomKey = string(bytes)
	return string(bytes)
}

func (h *Handshake) CreateRoom(offer string) (*CreateRoomResponse, error) {
	peerSession, err := h.QueryHandshake("create", offer)

	if err != nil {
		return nil, fmt.Errorf("failed to create room: %v", err)
	}

	return &CreateRoomResponse{
		PeerSeesion: peerSession,
		RoomKey:     h.RoomKey,
	}, nil

}

func (h *Handshake) JoinRoom(roomKey string) (string, error) {

	h.RoomKey = roomKey

	hostSession, err := h.QueryHandshake("join", "")
	if err != nil {
		return "", fmt.Errorf("failed to connect to peer: %v", err)
	}

	return hostSession, nil
}

func (h *Handshake) AcceptConnection(offer string) error {

	//ignoring the output here becuase its just a text that says ok
	_, err := h.QueryHandshake("accept", offer)
	if err != nil {
		return fmt.Errorf("failed to make connection: %v", err)
	}

	return nil

}

func (h *Handshake) QueryHandshake(endpoint, offer string) (string, error) {

	var b Offer

	client := &http.Client{
		Timeout: 60 * time.Second,
	}

	url, err := url.JoinPath(h.BaseURL, endpoint)

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
	param.Add("room", h.RoomKey)
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
