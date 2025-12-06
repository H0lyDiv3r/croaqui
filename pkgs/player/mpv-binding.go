package player

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	customErr "myproject/pkgs/error"

	"github.com/gen2brain/go-mpv"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type Player struct {
	ctx       context.Context
	mpv       *mpv.Mpv
	execQueue chan Command
}

type PlayerStatus struct {
	Paused   any `json:"paused"`
	Position any `json:"position"`
	Duration any `json:"duration"`
	Volume   any `json:"volume"`
	Muted    any `json:"Muted"`
	Speed    any `json:"speed"`
}

type ReturnType struct {
	Data interface{} `json:"data"`
}

type Command struct {
	Fn         func() (any, error)
	ReturnChan chan interface{}
	ErrChan    chan error
}

func MPV() *Player {
	return &Player{}
}

func (p *Player) StartUp(ctx context.Context) {
	p.ctx = ctx
	mpvInstance := mpv.New()
	p.execQueue = make(chan Command, 20)

	p.mpv = mpvInstance
	if err := p.mpv.Initialize(); err != nil {
		return
	}
	eventLoopReady := make(chan struct{})
	go p.EventLoop(eventLoopReady)

	<-eventLoopReady

	p.execute(
		func() (any, error) {
			p.mpv.SetProperty("vid", mpv.FormatFlag, false)
			p.mpv.RequestEvent(mpv.EventFileLoaded, true)
			p.mpv.RequestEvent(mpv.EventEnd, true)
			p.mpv.RequestEvent(mpv.EventPlaybackRestart, true)
			return nil, nil
		},
	)

}

func (p *Player) execute(fn func() (any, error)) (any, error) {
	returnChan := make(chan interface{})
	errChan := make(chan error)

	p.execQueue <- Command{
		Fn:         fn,
		ReturnChan: returnChan,
		ErrChan:    errChan,
	}
	return <-returnChan, <-errChan
}

func (p *Player) EventLoop(eventLoopReady chan struct{}) {
	close(eventLoopReady)

	for {

		select {
		case <-p.ctx.Done():
			fmt.Print("terminating and destroying")
			p.mpv.TerminateDestroy()
			return

		case cmd := <-p.execQueue:
			result, err := cmd.Fn()
			cmd.ReturnChan <- result
			cmd.ErrChan <- err

		default:
			ev := p.mpv.WaitEvent(0)
			if ev == nil {
				continue
			}
			if ev.EventID == mpv.EventQueueOverflow {
				log.Println("Event queue overflow detected! Clearing or slowing down event processing.")
			}
			switch ev.EventID {
			case mpv.EventEnd:
				end := ev.EndFile()
				if end.Reason == mpv.EndFileEOF {
					fmt.Println("ended because of eof")
					runtime.EventsEmit(p.ctx, "MPV:END", struct {
						Reason  string `json:"reason"`
						Message string `json:"message"`
					}{
						Reason:  "eof",
						Message: "end of file reached",
					})
				} else {
					fmt.Println("ended for some stupid reason", end.Reason)
					runtime.EventsEmit(p.ctx, "MPV:END", struct {
						Reason  string `json:"reason"`
						Message string `json:"message"`
					}{
						Message: "unknown",
					})
				}
			case mpv.EventFileLoaded, mpv.EventPlaybackRestart, mpv.EventAudioReconfig:
				fmt.Println("the file is loaded")
				runtime.EventsEmit(p.ctx, "MPV:FILE_LOADED", struct{}{})

			}
		}
	}
}

func (p *Player) LoadMusic(url string) (*ReturnType, error) {

	runtime.EventsEmit(p.ctx, "MPV:END", struct {
		Reason  string `json:"reason"`
		Message string `json:"message"`
	}{Reason: "restarting", Message: "restarting file"})
	_, err := p.execute(
		func() (any, error) {
			return nil, p.mpv.Command([]string{"loadfile", url})
		},
	)
	if err != nil {
		emitter := customErr.New("player_error", fmt.Errorf("failed to load audio:%w", err).Error())
		emitter.Emit(p.ctx)
		return nil, err
	}

	return &ReturnType{Data: struct {
		Loaded bool `json:"loaded"`
	}{Loaded: true}}, err
}

// refactor to use taglib maybe
func (p *Player) GetMetadata() (*ReturnType, error) {

	data, err := p.execute(
		func() (any, error) {
			data, err := p.mpv.GetProperty("metadata", mpv.FormatString)
			if err != nil {
				return nil, err
			}
			return data, nil
		},
	)
	if err != nil {
		return nil, err
	}
	var result interface{}

	err = json.Unmarshal([]byte(data.(string)), &result)
	if err != nil {
		return nil, err
	}
	return &ReturnType{Data: struct {
		MetaData interface{} `json:"metadata"`
	}{MetaData: result}}, nil
}

func (p *Player) TogglePlay() (*ReturnType, error) {

	data, err := p.execute(func() (any, error) {
		if err := p.mpv.Command([]string{"cycle", "pause"}); err != nil {
			emitter := customErr.New("player_error", fmt.Errorf("failed to pause/play:%w", err).Error())
			emitter.Emit(p.ctx)
			return nil, err
		}
		paused, _ := p.mpv.GetProperty("pause", mpv.FormatFlag)
		val, _ := p.mpv.GetProperty("time-pos", mpv.FormatDouble)
		return struct {
			Paused   bool    `json:"paused"`
			Position float64 `json:"position"`
		}{Paused: paused.(bool), Position: val.(float64)}, nil
	})

	if err != nil {
		return nil, err
	}

	result := data.(struct {
		Paused   bool    `json:"paused"`
		Position float64 `json:"position"`
	})

	return &ReturnType{Data: struct {
		Paused   bool    `json:"paused"`
		Position float64 `json:"position"`
	}{Paused: result.Paused, Position: result.Position},
	}, nil
}

func (p *Player) ToggleMute() (*ReturnType, error) {

	data, err := p.execute(func() (any, error) {
		if err := p.mpv.Command([]string{"cycle", "mute"}); err != nil {
			emitter := customErr.New("player_error", fmt.Errorf("failed to mute/unmute:%w", err).Error())
			emitter.Emit(p.ctx)
			return nil, err
		}
		isMuted, _ := p.mpv.GetProperty("mute", mpv.FormatFlag)
		return struct {
			Muted bool `json:"muted"`
		}{Muted: isMuted.(bool)}, nil
	})
	result := data.(struct {
		Muted bool `json:"muted"`
	})
	return &ReturnType{Data: struct {
		Muted bool `json:"muted"`
	}{Muted: result.Muted}}, err
}

// set speed
func (p *Player) SetSpeed(speed float64) (*ReturnType, error) {
	data, err := p.execute(
		func() (any, error) {

			if err := p.mpv.SetProperty("speed", mpv.FormatDouble, speed); err != nil {
				emitter := customErr.New("player_error", fmt.Errorf("failed to set playback speed:%w", err).Error())
				emitter.Emit(p.ctx)
				return nil, err
			}
			val, _ := p.mpv.GetProperty("speed", mpv.FormatDouble)
			return &ReturnType{Data: struct {
				Speed float64 `json:"speed"`
			}{Speed: val.(float64)}}, nil
		},
	)
	result := data.(struct {
		Speed float64 `json:"speed"`
	})
	return &ReturnType{Data: struct {
		Speed float64 `json:"speed"`
	}{Speed: result.Speed}}, err
}

// set position
func (p *Player) SetPosition(position float64) (*ReturnType, error) {
	_, err := p.execute(
		func() (any, error) {

			if err := p.mpv.SetProperty("time-pos", mpv.FormatDouble, position); err != nil {
				emitter := customErr.New("player_error", fmt.Errorf("failed to set playback position:%w", err).Error())
				emitter.Emit(p.ctx)
				return nil, err
			}
			return nil, nil
		},
	)
	return nil, err
}

func (p *Player) GetPosition() (*ReturnType, error) {
	data, err := p.execute(
		func() (any, error) {
			val, err := p.mpv.GetProperty("time-pos", mpv.FormatDouble)
			return struct {
				Position float64 `json:"position"`
			}{Position: val.(float64)}, err
		},
	)
	result := data.(struct {
		Position float64 `json:"position"`
	})
	return &ReturnType{Data: struct {
		Position float64 `json:"position"`
	}{Position: result.Position}}, err
}

// set volume
func (p *Player) SetVolume(volume int) (*ReturnType, error) {
	data, err := p.execute(
		func() (any, error) {

			if err := p.mpv.SetProperty("volume", mpv.FormatInt64, int64(volume)); err != nil {
				emitter := customErr.New("player_error", fmt.Errorf("failed to set volume position:%w", err).Error())
				emitter.Emit(p.ctx)
				return nil, err
			}
			val, _ := p.mpv.GetProperty("volume", mpv.FormatInt64)
			return struct {
				Volume int64 `json:"volume"`
			}{Volume: val.(int64)}, nil
		},
	)
	result := data.(struct {
		Volume int64 `json:"volume"`
	})
	return &ReturnType{Data: struct {
		Volume int64 `json:"volume"`
	}{Volume: result.Volume}}, err
}

func (p *Player) GetStatus() (*ReturnType, error) {
	data, err := p.execute(
		func() (any, error) {
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

			return status, nil
		},
	)

	if err != nil {
		return nil, err
	}

	result := data.(PlayerStatus)
	return &ReturnType{Data: result}, nil
}

func (p *Player) GetImage() (*ReturnType, error) {
	b64, err := GetImageFromAudio(p.mpv)
	if err != nil {
		log.Print(fmt.Errorf("failed to load image:%w", err).Error())
		return nil, err
	}
	return &ReturnType{Data: struct {
		Success bool   `json:"success"`
		Image   string `json:"image"`
	}{Success: true, Image: b64}}, nil
}

func GetImageFromAudio(m *mpv.Mpv) (string, error) {
	// if err := os.MkdirAll("./tmp", 0755); err != nil {
	// 	return "", err
	// }

	// countRaw, err := m.GetProperty("track-list/count", mpv.FormatInt64)
	// if err != nil {
	// 	log.Printf("failed to get track count: %v", err)
	// 	return "", err
	// }

	// count := countRaw.(int64)

	// // Subscribe to property updates
	// for i := range count {
	// 	prop := fmt.Sprintf("track-list/%d/albumart", i)
	// 	val, err := m.GetProperty(prop, mpv.FormatFlag)

	// 	if err != nil {
	// 		log.Printf("failed to get album art: %v", err)
	// 		return "", err
	// 	}
	// 	if art, ok := val.(bool); ok && art {
	// 		idProp := fmt.Sprintf("track-list/%d/id", 1)
	// 		idRaw, _ := m.GetProperty(idProp, mpv.FormatInt64)
	// 		id := idRaw.(int64)
	// 		m.SetPropertyString("vo", "null")
	// 		m.SetProperty("vid", mpv.FormatInt64, id)
	// 		//create output files
	// 		tempfile, err := os.CreateTemp("./tmp", "album_image_*.jpg")
	// 		defer os.Remove(tempfile.Name())
	// 		tempfile.Close()

	// 		output := tempfile.Name()
	// 		for {
	// 			ev := m.WaitEvent(0.1)
	// 			if ev != nil && ev.EventID == mpv.EventVideoReconfig {
	// 				break
	// 			}
	// 		}
	// 		// output := "./tmp/album_art.jpg"
	// 		time.Sleep(100 * time.Millisecond)
	// 		if err := m.Command([]string{"screenshot-to-file", output}); err != nil {
	// 			log.Printf("failed to take screenshot: %v", err)
	// 			return "", err
	// 		}
	// 		data, err := os.ReadFile(output)
	// 		if err != nil {
	// 			return "", err
	// 		}
	// 		b64 := base64.StdEncoding.EncodeToString(data)
	// 		return b64, nil
	// 	}

	// }
	return "", fmt.Errorf("no album art found")
}
