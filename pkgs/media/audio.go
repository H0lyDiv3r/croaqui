package media

import (
	"encoding/json"
	"fmt"
	"io/fs"
	"log"
	"myproject/pkgs/db"
	"myproject/pkgs/player"
	"path/filepath"
	"strings"
	"time"

	"github.com/gen2brain/go-mpv"
)

// getAudio
func (m *Media) GetAudio(filter string) (*ReturnType, error) {
	type audio struct {
		Id       int    `json:"id"`
		Name     string `json:"name"`
		Path     string `json:"path"`
		Title    string `json:"title"`
		Artist   string `json:"artist"`
		Album    string `json:"album"`
		Duration string `json:"duration"`
		Genre    string `json:"genre"`
	}

	var result = []audio{}

	var filterSettings struct {
		Artist string `json:"artist"`
		Album  string `json:"album"`
		Genre  string `json:"genre"`
		Path   string `json:"path"`
		Title  string `json:"title"`
		Sort   []struct {
			Field string `json:"field"`
			Order string `json:"order"`
		} `json:"sort"`
		Limit int `json:"limit"`
		Page  int `json:"page"`
	}

	err := json.Unmarshal([]byte(filter), &filterSettings)
	if err != nil {
		return nil, err
	}
	query := db.DBInstance.Instance.Model(&db.MusicFile{}).Select("*").Joins(`LEFT JOIN music_meta_data mm ON music_files.meta_data_id = mm.id`)

	if filterSettings.Path != "" {
		query = query.Where(`path LIKE ?`, filterSettings.Path+"%")
	}
	if filterSettings.Title != "" {
		query = query.Where(`title LIKE ?`, filterSettings.Title)
	}
	if filterSettings.Artist != "" {
		query = query.Where(`artist LIKE ?`, filterSettings.Artist)
	}
	if filterSettings.Album != "" {
		query = query.Where(`album LIKE ?`, filterSettings.Album)
	}
	if filterSettings.Genre != "" {
		query = query.Where(`genre LIKE ?`, filterSettings.Genre)
	}
	if len(filterSettings.Sort) > 0 {
		for _, sort := range filterSettings.Sort {
			query = query.Order(fmt.Sprintf("%s %s", sort.Field, sort.Order))
		}
	}

	var count int64
	query.Count(&count)
	offset := filterSettings.Page * filterSettings.Limit
	fmt.Println("this is the new offset:", filterSettings)
	if filterSettings.Limit > 0 {
		query = query.Limit(filterSettings.Limit)
		query = query.Offset(offset)
	}

	query.Scan(&result)

	return &ReturnType{Data: struct {
		Files   []audio `json:"files"`
		HasMore bool    `json:"hasMore"`
	}{Files: result, HasMore: offset+filterSettings.Limit < int(count)}}, nil
}

// writeAudio
func (m *Media) ScanForAudio(path string) error {
	err := filepath.WalkDir(path, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return nil
		}
		if d.IsDir() {
			parts := strings.Split(path, "/")
			db.DBInstance.WriteDirData(db.Directory{
				Name:       d.Name(),
				Path:       path,
				ParentPath: filepath.Dir(path),
				Depth:      len(parts) - 1,
			})
		}

		if isAudioFile(path) {
			err := db.DBInstance.WriteAudioData(path)
			if err != nil {
				return err
			}
		}
		return nil
	})

	if err != nil {
		log.Println(err)
		return err
	}
	return nil
}

//updateAudio

// getAlbums
func (m *Media) GetAlbums() (*ReturnType, error) {

	type album struct {
		Path     string `json:"path"`
		Album    string `json:"album"`
		Artist   string `json:"artist"`
		Duration string `json:"duration"`
		Image    string `json:"image"`
	}

	var result []album

	db.DBInstance.Instance.Raw(`
	SELECT path,album,artist,duration FROM music_files m
	LEFT JOIN music_meta_data mm ON m.meta_data_id = mm.id

	GROUP BY album
	`).Scan(&result)

	// fmt.Println("this is it buddy", result[0].Path)

	for idx, item := range result {
		img, err := fetchImage(item.Path)
		if err != nil {
			fmt.Println("error fetching image", err)
			result[idx].Image = fmt.Sprintf("%s/%s", item.Path, "cover.jpg")
			continue
		}
		result[idx].Image = img
	}

	fmt.Print("show me whay you are doing", result)
	// url := "/home/yuri/Data/projects/music-player-go/test-files/tst.m4a"
	// metaData, _ := ffmpeg.FFmpegInstance.GetMetadataFFProbe("/home/yuri/Data/projects/music-player-go/test-files/tst.m4a")
	// fmt.Println("this is the metadata", metaData)
	//

	// fmt.Println("i am returning the image bro", res)
	return &ReturnType{
		Data: struct {
			Albums []album `json:"albums"`
		}{Albums: result},
	}, nil
}

func (m *Media) GetAlbumsWithRoutines() (*ReturnType, error) {

	type album struct {
		Path     string `json:"path"`
		Album    string `json:"album"`
		Artist   string `json:"artist"`
		Duration string `json:"duration"`
		Image    string `json:"image"`
	}

	var result []album

	db.DBInstance.Instance.Raw(`
	SELECT path,album,artist,duration FROM music_files m
	LEFT JOIN music_meta_data mm ON m.meta_data_id = mm.id

	GROUP BY album
	`).Scan(&result)

	// fmt.Println("this is it buddy", result[0].Path)

	workers := 4
	jobs := make(chan int, len(result))
	done := make(chan struct{})
	for _ = range workers {
		go func() {
			for job := range jobs {
				fmt.Println("this are the jobs", job)
				img, err := fetchImage(result[job].Path)
				if err != nil {
					fmt.Println("error fetching image", err)
					result[job].Image = "no image"
					continue
				}
				result[job].Image = img
				// fmt.Println("sowing image", result[job])
				done <- struct{}{}
			}
		}()
	}

	for i := range result {
		jobs <- i
	}
	close(jobs)

	for _ = range workers {
		<-done
	}

	fmt.Print("show me whay you are doing", result)
	// url := "/home/yuri/Data/projects/music-player-go/test-files/tst.m4a"
	// metaData, _ := ffmpeg.FFmpegInstance.GetMetadataFFProbe("/home/yuri/Data/projects/music-player-go/test-files/tst.m4a")
	// fmt.Println("this is the metadata", metaData)
	//

	// fmt.Println("i am returning the image bro", res)
	return &ReturnType{
		Data: struct {
			Albums []album `json:"albums"`
		}{Albums: result},
	}, nil

}

func fetchImage(url string) (string, error) {

	// var b64 string
	p := mpv.New()
	p.Initialize()
	defer p.TerminateDestroy()
	p.SetProperty("pause", mpv.FormatFlag, true)
	p.SetProperty("vid", mpv.FormatFlag, false)
	if err := p.Command([]string{"loadfile", url}); err != nil {
		fmt.Println("unable to load")
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
				b64, err := player.GetImageFFprobe(p)
				if err != nil {

					return "", err
				}
				return b64, nil
			}
		}
	}
}

// getArtists
// func (p *Player) LoadMusic(url string) (*ReturnType, error) {
// 	if err := p.mpv.Command([]string{"loadfile", url}); err != nil {
// 		fmt.Println("unable to load")
// 		log.Fatal("unable to load music", err)
// 		return nil, err
// 	}

// 	for {
// 		ev := p.mpv.WaitEvent(-1)
// 		if ev.EventID == mpv.EventFileLoaded {
// 			fmt.Println("the file is loaded")
// 			return &ReturnType{Data: struct {
// 				Loaded bool `json:"loaded"`
// 			}{Loaded: true}}, nil
// 		}
// 	}

// }
