package player

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/H0lyDiv3r/croaqui/internals/taglib"
	customErr "github.com/H0lyDiv3r/croaqui/pkgs/error"
	"github.com/H0lyDiv3r/croaqui/pkgs/mpris"
	"github.com/H0lyDiv3r/croaqui/pkgs/sharedTypes"
	"github.com/godbus/dbus/v5"

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
	Muted    any `json:"muted"`
	Speed    any `json:"speed"`
}

type ReturnType = sharedTypes.ReturnType

type Command struct {
	Fn         func() (any, error)
	ReturnChan chan interface{}
	ErrChan    chan error
}

var PlayerInstance *Player

func MPV() *Player {
	PlayerInstance = &Player{}
	return PlayerInstance
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

	_, _ = p.execute(
		func() (any, error) {
			_ = p.mpv.SetProperty("vid", mpv.FormatFlag, false)
			_ = p.mpv.RequestEvent(mpv.EventFileLoaded, true)
			_ = p.mpv.RequestEvent(mpv.EventEnd, true)
			_ = p.mpv.RequestEvent(mpv.EventPlaybackRestart, true)
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
			case mpv.EventFileLoaded:
				fmt.Println("the file is loaded")

				go p.GetMetadata()
				runtime.EventsEmit(p.ctx, "MPV:FILE_LOADED", struct{}{})

			}
		}
	}
}

func (p *Player) LoadMusic(url string, paused bool) (*ReturnType, error) {

	runtime.EventsEmit(p.ctx, "MPV:END", struct {
		Reason  string `json:"reason"`
		Message string `json:"message"`
	}{Reason: "restarting", Message: "restarting file"})
	_, err := p.execute(
		func() (any, error) {
			err := p.mpv.SetProperty("pause", mpv.FormatFlag, paused)
			if err != nil {
				return nil, err
			}
			return nil, p.mpv.Command([]string{"loadfile", url})
		},
	)
	if err != nil {
		emitter := customErr.New("player_error", fmt.Errorf("failed to load audio:%w", err).Error())
		emitter.Emit(p.ctx)
		return nil, err
	}

	stats, _ := p.GetStatus()

	if status, ok := stats.Data.(PlayerStatus); ok {
		if status.Paused.(bool) {
			mpris.MprisInstance.EmitPropertiesChanged(map[string]dbus.Variant{
				"PlaybackStatus": dbus.MakeVariant("Paused"),
			})
		} else {
			mpris.MprisInstance.EmitPropertiesChanged(map[string]dbus.Variant{
				"PlaybackStatus": dbus.MakeVariant("Playing"),
			})
		}
	}

	return &ReturnType{Data: struct {
		Loaded bool `json:"loaded"`
	}{Loaded: true}}, err
}

// refactor to use taglib maybe
func (p *Player) GetMetadata() (*ReturnType, error) {
	type Metadata struct {
		Title       string `json:"title"`
		Artist      string `json:"artist"`
		Album       string `json:"album"`
		TrackNumber int    `json:"track_number"`
		Duration    int    `json:"duration"`
	}

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

	var result Metadata
	err = json.Unmarshal([]byte(data.(string)), &result)
	if err != nil {
		return nil, err
	}

	fmt.Println("showing metadata", result)
	dbusMd := map[string]dbus.Variant{
		// "mpris:trackid": dbus.MakeVariant(dbus.ObjectPath("/track/1")),
		"xesam:title":  dbus.MakeVariant(result.Title),
		"xesam:artist": dbus.MakeVariant([]string{result.Artist}),
		"mpris:length": dbus.MakeVariant(result.Duration * 1000), // ms → μs
	}

	mpris.MprisInstance.EmitPropertiesChanged(
		map[string]dbus.Variant{"Metadata": dbus.MakeVariant(dbusMd)},
	)
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

	if result.Paused {
		mpris.MprisInstance.EmitPropertiesChanged(map[string]dbus.Variant{
			"PlaybackStatus": dbus.MakeVariant("Paused"),
		})
	} else {
		mpris.MprisInstance.EmitPropertiesChanged(map[string]dbus.Variant{
			"PlaybackStatus": dbus.MakeVariant("Playing"),
		})
	}

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
			return struct {
				Speed float64 `json:"speed"`
			}{Speed: val.(float64)}, nil
		},
	)
	result := data.(struct {
		Speed float64 `json:"speed"`
	})
	fmt.Println("Speed set successfully", result)
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

func (p *Player) GetImage(path string) (*ReturnType, error) {
	res, err := taglib.GetAlbumCover(path)
	if err != nil {
		return nil, err
	}

	img := base64.StdEncoding.EncodeToString(res.Data)

	data, _ := base64.StdEncoding.DecodeString(img)

	os.Remove(mpris.MprisInstance.AlbumArtUrl)
	tempFile, err := os.CreateTemp("", "mpris-cover-*."+strings.Split(res.MimeType, "/")[1])
	if err != nil {

	}
	filename := tempFile.Name()
	tempFile.Close()

	mpris.MprisInstance.SetAlbumArtUrl(filename)
	err = os.WriteFile(filename, data, 0644)
	if err != nil {
		os.Remove(filename)
	}

	dbusMd := map[string]dbus.Variant{
		"mpris:artUrl": dbus.MakeVariant(filename), // ms → μs
	}

	mpris.MprisInstance.EmitPropertiesChanged(
		map[string]dbus.Variant{"Metadata": dbus.MakeVariant(dbusMd)},
	)
	return &ReturnType{Data: struct {
		Success bool   `json:"success"`
		Image   string `json:"image"`
	}{Success: true, Image: fmt.Sprintf("data:%s;base64,%s", res.MimeType, img)}}, nil
}

func (p *Player) SetPlayerStats(playerStatus PlayerStatus) (*ReturnType, error) {
	data, err := p.execute(func() (any, error) {
		res := PlayerStatus{}

		if playerStatus.Paused != nil {
			if err := p.mpv.SetProperty("pause", mpv.FormatFlag, playerStatus.Paused.(bool)); err != nil {
				return nil, err
			}
			res.Paused = playerStatus.Paused
		}

		if playerStatus.Volume != nil {
			volume := int64(playerStatus.Volume.(float64))
			if err := p.mpv.SetProperty("volume", mpv.FormatInt64, volume); err != nil {
				return nil, err
			}
			res.Volume = playerStatus.Volume
		}

		if playerStatus.Muted != nil {
			if err := p.mpv.SetProperty("mute", mpv.FormatFlag, playerStatus.Muted.(bool)); err != nil {
				return nil, err
			}

			res.Muted = playerStatus.Muted
		}

		if playerStatus.Speed != nil {
			if err := p.mpv.SetProperty("speed", mpv.FormatDouble, playerStatus.Speed.(float64)); err != nil {
				return nil, err
			}
			res.Speed = playerStatus.Speed
		}

		if playerStatus.Position != nil {
			if err := p.mpv.SetProperty("time-pos", mpv.FormatDouble, playerStatus.Position.(float64)); err != nil {
				return nil, err
			}
			res.Position = playerStatus.Position
		}

		return res, nil
	})

	return &ReturnType{Data: struct {
		Updated PlayerStatus `json:"updated"`
	}{Updated: data.(PlayerStatus)}}, err
}

func (p *Player) OnShutdown() {
	p.mpv.TerminateDestroy()
}
