package player

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/gen2brain/go-mpv"
	"github.com/wailsapp/wails/v2/pkg/runtime"
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

type ReturnType struct {
	Data interface{} `json:"data"`
}

func MPV() *Player {
	return &Player{}
}

func (p *Player) StartUp(ctx context.Context) {
	p.ctx = ctx
	mpvInstance := mpv.New()

	p.mpv = mpvInstance
	if err := p.mpv.Initialize(); err != nil {
		log.Fatal("failed to initialize player")
		return
	}
	// defer p.mpv.TerminateDestroy()

	go func() {
		for {
			ev := p.mpv.WaitEvent(10)
			switch ev.EventID {
			case mpv.EventEnd:
				end := ev.EndFile()
				if end.Reason == mpv.EndFileEOF {
					fmt.Println("ended because of eof")
					runtime.EventsEmit(ctx, "MPV:END", struct {
						Message string `json:"reason"`
					}{
						Message: "end of file reached",
					})
				} else {
					fmt.Println("ended for some stupid reason")
					runtime.EventsEmit(ctx, "MPV:END", struct {
						Message string `json:"reason"`
					}{
						Message: "unknown",
					})
				}
			case mpv.EventFileLoaded:
				fmt.Println("the file is loaded")
				runtime.EventsEmit(ctx, "MPV:FILE_LOADED")
			}
		}
	}()
	log.Print("player initialized successfuly")
}

func (p *Player) LoadMusic(url string) error {
	p.mpv.SetProperty("pause", mpv.FormatFlag, true)
	p.mpv.SetProperty("vid", mpv.FormatFlag, false)
	if err := p.mpv.Command([]string{"loadfile", url}); err != nil {
		fmt.Println("unable to load")
		log.Fatal("unable to load music", err)
		return err
	}
	return nil
}

func (p *Player) GetMetadata() (*ReturnType, error) {
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
	return &ReturnType{Data: struct {
		MetaData interface{} `json:"metadata"`
	}{MetaData: result}}, nil
}

func (p *Player) TogglePlay() (*ReturnType, error) {
	if err := p.mpv.Command([]string{"cycle", "pause"}); err != nil {
		log.Fatal("unable to play music", err)
		return nil, err
	}
	paused, _ := p.mpv.GetProperty("pause", mpv.FormatFlag)
	val, _ := p.mpv.GetProperty("time-pos", mpv.FormatDouble)

	return &ReturnType{Data: struct {
		Paused   bool    `json:"paused"`
		Position float64 `json:"position"`
	}{Paused: paused.(bool), Position: val.(float64)},
	}, nil
}

func (p *Player) ToggleMute() (*ReturnType, error) {
	if err := p.mpv.Command([]string{"cycle", "mute"}); err != nil {
		log.Fatal("unable to toggle mute", err)
		return nil, err
	}
	isMuted, _ := p.mpv.GetProperty("mute", mpv.FormatFlag)
	return &ReturnType{Data: struct {
		Muted bool `json:"muted"`
	}{Muted: isMuted.(bool)}}, nil
}

// set speed
func (p *Player) SetSpeed(speed float64) (*ReturnType, error) {
	if err := p.mpv.SetProperty("speed", mpv.FormatDouble, speed); err != nil {
		log.Fatal("unable to set speed", err)
		return nil, err
	}
	val, _ := p.mpv.GetProperty("speed", mpv.FormatDouble)
	return &ReturnType{Data: struct {
		Speed float64 `json:"speed"`
	}{Speed: val.(float64)}}, nil
}

// set position
func (p *Player) SetPosition(position float64) error {
	if err := p.mpv.SetProperty("time-pos", mpv.FormatDouble, position); err != nil {
		log.Fatal("unable to set position", err)
		return err
	}
	return nil
}

func (p *Player) GetPosition() (*ReturnType, error) {
	val, _ := p.mpv.GetProperty("time-pos", mpv.FormatDouble)
	return &ReturnType{Data: struct {
		Position float64 `json:"position"`
	}{Position: val.(float64)}}, nil
}

// set volume
func (p *Player) SetVolume(volume int) (*ReturnType, error) {
	if err := p.mpv.SetProperty("volume", mpv.FormatInt64, int64(volume)); err != nil {
		log.Fatal("unable to set volume", err)
		return nil, err
	}
	val, _ := p.mpv.GetProperty("volume", mpv.FormatInt64)
	return &ReturnType{Data: struct {
		Volume int64 `json:"volume"`
	}{Volume: val.(int64)}}, nil
}

func (p *Player) GetStatus() (*ReturnType, error) {
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
	return &ReturnType{Data: status}, nil
}

func (p *Player) GetImage() (*ReturnType, error) {
	b64, err := GetImageFromAudio(p.mpv)
	if err != nil {
		return nil, err
	}
	return &ReturnType{Data: struct {
		Success bool   `json:"success"`
		Image   string `json:"image"`
	}{Success: true, Image: b64}}, nil
}

func GetImageFromAudio(m *mpv.Mpv) (string, error) {
	if err := os.MkdirAll("./tmp", 0755); err != nil {
		return "", err
	}

	countRaw, err := m.GetProperty("track-list/count", mpv.FormatInt64)
	if err != nil {
		log.Printf("failed to get track count: %v", err)
		return "", err
	}

	count := countRaw.(int64)

	// Subscribe to property updates
	for i := range count {
		prop := fmt.Sprintf("track-list/%d/albumart", i)
		val, err := m.GetProperty(prop, mpv.FormatFlag)

		if err != nil {
			log.Printf("failed to get album art: %v", err)
			return "", err
		}
		if art, ok := val.(bool); ok && art {
			idProp := fmt.Sprintf("track-list/%d/id", 1)
			idRaw, _ := m.GetProperty(idProp, mpv.FormatInt64)
			id := idRaw.(int64)
			m.SetPropertyString("vo", "null")
			m.SetProperty("vid", mpv.FormatInt64, id)
			//create output files
			tempfile, err := os.CreateTemp("./tmp", "album_image_*.jpg")
			defer os.Remove(tempfile.Name())
			tempfile.Close()

			output := tempfile.Name()
			for {
				ev := m.WaitEvent(0.1)
				if ev != nil && ev.EventID == mpv.EventVideoReconfig {
					break
				}
			}
			// output := "./tmp/album_art.jpg"
			time.Sleep(100 * time.Millisecond)
			if err := m.Command([]string{"screenshot-to-file", output}); err != nil {
				log.Printf("failed to take screenshot: %v", err)
				return "", err
			}
			data, err := os.ReadFile(output)
			if err != nil {
				return "", err
			}
			b64 := base64.StdEncoding.EncodeToString(data)
			return b64, nil
		}

	}
	return "", fmt.Errorf("no album art found")
}
