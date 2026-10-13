package stream

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type Offer struct {
	Offer string `json:"offer"`
}

type Handshake struct {
	BaseURL string
	RoomKey string
}

func NewHandshake(url string) *Handshake {
	return &Handshake{
		BaseURL: url,
	}
}

func (h *Handshake) GenerateRoomKey() string {
	h.RoomKey = "test"
	return "test"
}

func (h *Handshake) CreateRoom(offer string) {

}

func (h *Handshake) JoinRoom(roomKey string) {

}

func (h *Handshake) AcceptConnection() {

}

func (h *Handshake) queryHandshake(url, offer, room string) (string, error) {

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
