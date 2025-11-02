package media

import (
	"context"
	"path/filepath"
	"slices"

	"github.com/wailsapp/wails/v2/pkg/runtime"
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

type Media struct {
	ctx context.Context
}

func NewMedia() *Media {
	return &Media{}
}

func (m *Media) StartUp(ctx context.Context) {
	m.ctx = ctx
	m.GetStandardDirs()
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
	}
	ext := filepath.Ext(path)
	// return ext == ".mp3" || ext == ".wav" || ext == ".flac"
	return slices.Contains(MPVSupportedFormats, ext)
}

func (m *Media) Emit(msg string) {
	runtime.EventsEmit(m.ctx, "toast:success", msg)
}
