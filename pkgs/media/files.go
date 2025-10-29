package media

import (
	"fmt"
	"log"
	"myproject/pkgs/db"
	customErr "myproject/pkgs/error"
	"myproject/pkgs/player"
	"os"
	"time"

	"github.com/gen2brain/go-mpv"
)

func (m *Media) GetContents(path string) (*ReturnType, error) {
	contents, err := os.ReadDir(path)
	if err != nil {
		emitter := customErr.New("file_error", fmt.Errorf("failed to read directory:%w", err).Error())
		emitter.Emit(m.ctx)
		return nil, err
	}
	var dirs []string
	for _, content := range contents {
		if content.IsDir() {
			dirs = append(dirs, content.Name())
		}
	}
	return &ReturnType{Data: DirectoryContents{Content: dirs}}, nil
}

func (m *Media) GetDirs(path string) (*ReturnType, error) {
	type dirs []struct {
		Id    int    `json:"id"`
		Name  string `json:"name"`
		Path  string `json:"path"`
		Depth int    `json:"depth"`
	}
	var result dirs

	//find the smallest depth starting with path
	res := db.DBInstance.Instance.Raw(`
		SELECT id,name,path,depth,parent_path pp FROM directories d
		WHERE pp LIKE ? AND depth = (
			SELECT MIN(depth) FROM directories d1
				WHERE d1.parent_path LIKE ?
		)
		`, path+"%", path+"%").Scan(&result)

	if res.Error != nil {
		emitter := customErr.New("db_error", fmt.Errorf("failed to fetch directories:%w", res.Error).Error())
		emitter.Emit(m.ctx)
		return nil, res.Error
	}
	return &ReturnType{Data: struct {
		Dirs dirs `json:"dirs"`
	}{Dirs: result}}, nil
}

func FetchImage(url string) (string, error) {
	p := mpv.New()
	p.Initialize()
	defer p.TerminateDestroy()
	p.SetProperty("pause", mpv.FormatFlag, true)
	p.SetProperty("vid", mpv.FormatFlag, false)
	if err := p.Command([]string{"loadfile", url}); err != nil {
		log.Print("unable to load music", err)
		return "", err
	}

	timeline := time.After(5 * time.Second)
	for {
		select {
		case <-timeline:
			return "", fmt.Errorf(" there has been an error loading path timeout")
		default:
			ev := p.WaitEvent(100)
			if ev.EventID == mpv.EventFileLoaded {
				b64, err := player.GetImageFromAudio(p)
				if err != nil {

					return "", err
				}
				return b64, nil
			}
		}
	}
}
