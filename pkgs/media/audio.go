package media

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/fs"
	"log"
	"myproject/pkgs/db"
	"path/filepath"
	"strings"
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
			if m.hasAudio(path) {
				parts := strings.Split(path, "/")
				db.DBInstance.WriteDirData(db.Directory{
					Name:       d.Name(),
					Path:       path,
					ParentPath: filepath.Dir(path),
					Depth:      len(parts) - 1,
				})
			}
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

func (m *Media) hasAudio(path string) bool {
	var ErrAudioFound = errors.New("audio file found")
	err := filepath.WalkDir(path, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if isAudioFile(path) {
			return ErrAudioFound
		}
		return nil
	})

	if err == ErrAudioFound {
		return true
	}

	return false

}

//updateAudio

// getAlbums

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
