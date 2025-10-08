package dir

import (
	"context"
	"fmt"
	"io/fs"
	"log"
	"os"
	"path/filepath"
	"slices"
)

type Directory struct {
	ctx context.Context
}

func NewDirectory() *Directory {
	return &Directory{}
}

func (d *Directory) StartUp(ctx context.Context) {
	d.ctx = ctx
}

func (d *Directory) GetContents(path string) (interface{}, error) {
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
	return struct {
		Content []string `json:"content"`
	}{Content: dirs}, nil
}

func (d *Directory) GetAudio(path string) (interface{}, error) {
	var audioFiles []string
	err := filepath.WalkDir(path, func(path string, d fs.DirEntry, err error) error {
		// if err != nil {
		// 	return err
		// }
		// isAudioFile(path)

		if d.IsDir() {
			return nil
		}

		if isAudioFile(path) {
			audioFiles = append(audioFiles, path)
		}
		fmt.Println("visited:", path, isAudioFile(path))
		return nil
	})

	if err != nil {
		log.Println(err)
		return nil, err
	}
	return struct {
		AudioFiles []string `json:"audio_files"`
	}{AudioFiles: audioFiles}, nil
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
