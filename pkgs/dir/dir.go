package dir

import (
	"context"
	"fmt"
	"io/fs"
	"log"
	"myproject/pkgs/db"
	"os"
	"path/filepath"
	"slices"
	"strings"
)

type DirectoryContents struct {
	Content []string `json:"content"`
}

type AudioFiles struct {
	AudioFiles []string `json:"audio_files"`
}

type ReturnType struct {
	Data interface{} `json:"data"`
}

type Directory struct {
	ctx context.Context
}

func NewDirectory() *Directory {
	return &Directory{}
}

func (d *Directory) StartUp(ctx context.Context) {
	d.ctx = ctx
}

func (d *Directory) GetContents(path string) (*ReturnType, error) {
	contents, err := os.ReadDir(path)
	if err != nil {
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

func (d *Directory) GetDirs(path string) (*ReturnType, error) {
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
			SELECT MIN(depth) FROM directories d2
				WHERE d2.parent_path LIKE ?
		)
		`, path+"%", path+"%").Scan(&result)

	fmt.Println("this is it", result, path)

	// res := db.DBInstance.Instance.Raw(`
	// 	SELECT name,path,depth FROM directories d
	//  	WHERE path LIKE ? AND depth > ?
	// 	`, path+"%", len(parts)+1).Scan(&result)
	if res.Error != nil {
		return nil, res.Error
	}
	return &ReturnType{Data: struct {
		Dirs dirs `json:"dirs"`
	}{Dirs: result}}, nil
}

func (d *Directory) GetAudio(path string) (*ReturnType, error) {
	var result []struct {
		Id       int    `json:"id"`
		Name     string `json:"name"`
		Path     string `json:"path"`
		Title    string `json:"title"`
		Artist   string `json:"artist"`
		Album    string `json:"album"`
		Duration string `json:"duration"`
		Genre    string `json:"genre"`
	}
	res := db.DBInstance.Instance.Raw(`
		SELECT *
		FROM music_files mf
		  	LEFT JOIN music_meta_data mmd ON mf.meta_data_id = mmd.id
		WHERE mf.path LIKE ?
		`, path+"%").Scan(&result)
	if res.Error != nil {
		return nil, res.Error
	}
	return &ReturnType{Data: struct {
		Files interface{} `json:"files"`
	}{Files: result}}, nil
}

func (d *Directory) ScanForAudio(path string) error {
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

func isAudioFile(path string) bool {
	MPVSupportedFormats := []string{
		// Lossy formats
		".mp3",
		".aac",
		".m4a",
		".ogg",
		".opus",
		".wma",
		".ac3",
		".eac3",
		".dts",

		// Lossless formats
		".flac",
		".alac",
		".wav",
		".aiff",
		".aif",
		".ape",
		".tta",

		// Container formats
		".mka",
		".avi",
		".mp4",
		".caf",
		".au",

		// Streaming / playlist formats
		".m3u",
		".m3u8",
		".pls",
	}
	ext := filepath.Ext(path)
	// return ext == ".mp3" || ext == ".wav" || ext == ".flac"
	return slices.Contains(MPVSupportedFormats, ext)
}
