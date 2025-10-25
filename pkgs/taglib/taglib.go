package taglib

/*
#cgo CFLAGS: -I${SRCDIR}/include
#cgo LDFLAGS: -L${SRCDIR}/pkgs/taglib/lib -ltag_c -ltag -lstdc++ -lz -lm
#include <tag_c.h>
#include <stdlib.h>
*/
import "C"
import (
	"context"
	"fmt"
	"unsafe"
)

type AudioMeta struct {
	Title  string
	Artist string
	Album  string
}

type Taglib struct {
	ctx context.Context
}

var TaglibInstance *Taglib

type Metadata struct {
	Format Format `json:"format"`
}
type Format struct {
	Filename string `json:"filename"`
	Duration int    `json:"duration"`
	Tags     struct {
		Title  string `json:"title"`
		Artist string `json:"artist"`
		Album  string `json:"album"`
		Genre  string `json:"genre"`
		Date   int    `json:"date"`
	} `json:"tags"`
}

func NewTaglib() *Taglib {
	TaglibInstance = &Taglib{}
	return TaglibInstance
}

func (t *Taglib) Startup(ctx context.Context) {
	t.ctx = ctx
	t.GetMetadataTaglib("/home/yuri/Data/music/The 1975 - Discography (2013-2020) (320)/2013 - The 1975/01 The 1975.mp3")
}

func (t *Taglib) GetMetadataTaglib(path string) (Metadata, error) {
	cpath := C.CString(path)
	defer C.free(unsafe.Pointer(cpath))

	fp := C.taglib_file_new(cpath)
	if fp == nil {
		return Metadata{}, fmt.Errorf("❌ failed to open file: %s", path)
	}
	defer C.taglib_file_free(fp)

	tag := C.taglib_file_tag(fp)
	if tag == nil {
		return Metadata{}, fmt.Errorf("❌ no tag found in file: %s", path)
	}

	props := C.taglib_file_audioproperties(fp)
	if props == nil {
		return Metadata{}, fmt.Errorf("no audio properties found")
	}

	album := C.GoString(C.taglib_tag_album(tag))
	artist := C.GoString(C.taglib_tag_artist(tag))
	title := C.GoString(C.taglib_tag_title(tag))
	year := int(C.taglib_tag_year(tag))
	genre := C.GoString(C.taglib_tag_genre(tag))
	duration := int(C.taglib_audioproperties_length(props))
	if album == "" {
		album = "unknown"
	}
	if artist == "" {
		artist = "unknown"
	}
	if title == "" {
		title = "unknown"
	}

	if genre == "" {
		genre = "unknown"
	}

	result := Metadata{
		Format: Format{
			Filename: path,
			Duration: duration,
			Tags: struct {
				Title  string `json:"title"`
				Artist string `json:"artist"`
				Album  string `json:"album"`
				Genre  string `json:"genre"`
				Date   int    `json:"date"`
			}{
				Title:  title,
				Artist: artist,
				Album:  album,
				Genre:  genre,
				Date:   year,
			},
		},
	}

	return result, nil
}
