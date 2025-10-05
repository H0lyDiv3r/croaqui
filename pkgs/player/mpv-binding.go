package player

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	"github.com/gen2brain/go-mpv"
)

type Player struct {
	ctx context.Context
	mpv *mpv.Mpv
}

type PlayerStatus struct {
	Paused   any `json:"paused"`   // "playing" or "paused"
	Position any `json:"position"` // seconds
	Duration any `json:"duration"` // seconds
	Volume   any `json:"volume"`   // 0-100
	Muted    any `json:"Muted"`
	Speed    any `json:"speed"`
}

func MPV() *Player {
	return &Player{}
}

func (p *Player) StartUp(ctx context.Context) {
	p.ctx = ctx
	mpv := mpv.New()

	p.mpv = mpv
	if err := p.mpv.Initialize(); err != nil {
		log.Fatal("failed to initialize player")
		return
	}
	// p.StartEventLoop()
	log.Print("player initialized successfuly")
}

func (p *Player) LoadMusic(url string) (interface{}, error) {
	p.mpv.SetProperty("pause", mpv.FormatFlag, true)
	p.mpv.SetProperty("vid", mpv.FormatFlag, false)
	if err := p.mpv.Command([]string{"loadfile", url}); err != nil {
		fmt.Println("unable to load")
		log.Fatal("unable to load music", err)
		return nil, err
	}

	for {
		ev := p.mpv.WaitEvent(-1) // wait indefinitely for next event
		if ev.EventID == mpv.EventFileLoaded {
			// File is loaded now
			return struct {
				Loaded bool `json:"loaded"`
			}{Loaded: true}, nil
		}
		// Optionally handle other events or add timeout/cancellation here
	}

}

func (p *Player) GetMetadata() (any, error) {
	data, err := p.mpv.GetProperty("metadata", mpv.FormatString)
	if err != nil {
		log.Fatal("unable to get metadata", err)
		return nil, err
	}
	var result interface{}
	err = json.Unmarshal([]byte(data.(string)), &result)
	if err != nil {
		log.Fatal("unable to unmarshal metadata", err)
		return nil, err
	}
	return result, nil
}

func (p *Player) TogglePlay() (any, error) {
	if err := p.mpv.Command([]string{"cycle", "pause"}); err != nil {
		log.Fatal("unable to play music", err)
		return nil, err
	}
	paused, _ := p.mpv.GetProperty("pause", mpv.FormatFlag)
	val, _ := p.mpv.GetProperty("time-pos", mpv.FormatDouble)
	return struct {
		Paused   bool    `json:"paused"`
		Position float64 `json:"position"`
	}{Paused: paused.(bool), Position: val.(float64)}, nil
}

func (p *Player) ToggleMute() (any, error) {
	if err := p.mpv.Command([]string{"cycle", "mute"}); err != nil {
		log.Fatal("unable to toggle mute", err)
		return nil, err
	}
	isMuted, _ := p.mpv.GetProperty("mute", mpv.FormatFlag)
	return struct {
		Muted bool `json:"muted"`
	}{Muted: isMuted.(bool)}, nil
}

// set speed
func (p *Player) SetSpeed(speed float64) interface{} {
	if err := p.mpv.SetProperty("speed", mpv.FormatDouble, speed); err != nil {
		log.Fatal("unable to set speed", err)
		return nil
	}
	val, _ := p.mpv.GetProperty("speed", mpv.FormatDouble)
	return struct {
		Speed float64 `json:"speed"`
	}{Speed: val.(float64)}
}

// set position
func (p *Player) SetPosition(position float64) error {
	if err := p.mpv.SetProperty("time-pos", mpv.FormatDouble, position); err != nil {
		log.Fatal("unable to set position", err)
		return err
	}
	return nil
}

func (p *Player) GetPosition() (any, error) {
	val, _ := p.mpv.GetProperty("time-pos", mpv.FormatDouble)
	return struct {
		Position float64 `json:"position"`
	}{Position: val.(float64)}, nil
}

// set volume
func (p *Player) SetVolume(volume int) (interface{}, error) {
	if err := p.mpv.SetProperty("volume", mpv.FormatInt64, int64(volume)); err != nil {
		log.Fatal("unable to set volume", err)
		return nil, err
	}
	val, _ := p.mpv.GetProperty("volume", mpv.FormatInt64)
	return struct {
		Volume int64 `json:"volume"`
	}{Volume: val.(int64)}, nil
}

func (p *Player) GetStatus() PlayerStatus {
	var status PlayerStatus

	paused, _ := p.mpv.GetProperty("pause", mpv.FormatFlag)
	status.Paused = paused

	position, _ := p.mpv.GetProperty("time-pos", mpv.FormatDouble)
	status.Position = position

	duration, _ := p.mpv.GetProperty("duration", mpv.FormatDouble)
	status.Duration = duration

	volume, _ := p.mpv.GetProperty("volume", mpv.FormatInt64)
	status.Volume = volume

	isMuted, _ := p.mpv.GetProperty("mute", mpv.FormatFlag)
	status.Muted = isMuted

	speed, _ := p.mpv.GetProperty("speed", mpv.FormatInt64)
	status.Speed = speed
	return status
}
