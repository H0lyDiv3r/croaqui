package media

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/fs"
	"log"
	"path/filepath"
	"strings"

	"github.com/H0lyDiv3r/croaqui/pkgs/db"
	customErr "github.com/H0lyDiv3r/croaqui/pkgs/error"
	"github.com/H0lyDiv3r/croaqui/pkgs/playlist"
)

// getAudio
type audio struct {
	Id         int    `json:"id"`
	Name       string `json:"name"`
	Path       string `json:"path"`
	Title      string `json:"title"`
	Artist     string `json:"artist"`
	Album      string `json:"album"`
	Duration   string `json:"duration"`
	ParentPath string `json:"parentPath"`
	Genre      string `json:"genre"`
	Favorite   bool   `json:"favorite"`
}

func (m *Media) GetAudio(filter string) (*ReturnType, error) {

	fmt.Println("showing audio in path", filter)

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
	query := db.DBInstance.Instance.Table("music_files m").
		Joins("LEFT JOIN music_meta_data mm ON m.meta_data_id = mm.id").
		Joins("LEFT JOIN playlist_musics pm ON pm.music_id = m.id").
		Joins("LEFT JOIN playlists p ON p.id = pm.playlist_id").
		Select("m.id, m.name, m.path, mm.title, mm.artist, mm.album, mm.duration,  mm.genre, "+
			"MAX(CASE WHEN p.name = ? THEN TRUE ELSE FALSE END) AS favorite", playlist.FAVORITES).
		Group("m.id, m.name, m.path, mm.title, mm.artist, mm.album, mm.duration,  mm.genre")

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

	if query.Error != nil {
		emitter := customErr.New("db_error", fmt.Errorf("fetching audio failed:%w", query.Error).Error())
		emitter.Emit(m.ctx)
		return &ReturnType{}, err
	}
	query.Count(&count)
	offset := filterSettings.Page * filterSettings.Limit
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

func (m *Media) SearchAudio(phrase string, fields []string) *ReturnType {

	var result = []audio{}
	queryString := `SELECT m.*,mm.*, m.name AS name, m.path AS path, mm.title AS title, mm.artist AS artist, mm.album AS album FROM music_files m LEFT JOIN music_meta_data mm ON m.meta_data_id = mm.id `

	if len(fields) > 0 {
		queryString += " WHERE "
		for i, item := range fields {

			if i > 0 {
				queryString += "OR "
			}
			queryString += fmt.Sprintf("%s LIKE ? ", item)
		}
	}

	params := make([]interface{}, len(fields))

	for i := range fields {
		params[i] = "%" + phrase + "%"
	}

	db.DBInstance.Instance.Raw(queryString, params...).Scan(&result)

	return &ReturnType{
		Data: struct {
			Songs []audio `json:"songs"`
		}{
			Songs: result,
		},
	}
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
				_ = db.DBInstance.WriteDirData(db.Directory{
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
				log.Print(fmt.Errorf("failed to write audio to db:%w", err))
			}
		}
		return nil
	})

	if err != nil {
		emitter := customErr.New("db_error", fmt.Errorf("failed to write files to db:%w", err).Error())
		emitter.Emit(m.ctx)
		return err
	}
	m.Emit("scan successful")
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
