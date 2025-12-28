package taglib

/*
#cgo CFLAGS: -I${SRCDIR}/include
#cgo LDFLAGS: -L${SRCDIR}/lib -ltag_c -ltag -lstdc++ -lz -lm
#include <tag_c.h>
#include <stdlib.h>
*/
import "C"
import (
	"fmt"
	"os"
	"path/filepath"
	"unsafe"
)

type AudioMeta struct {
	Title  string
	Artist string
	Album  string
}

type AlbumCover struct {
	Data     []byte `json:"data"`
	MimeType string `json:"mimeType"`
}

// type Taglib struct {
// 	ctx context.Context
// }

// var TaglibInstance *Taglib

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

// func NewTaglib() *Taglib {
// 	TaglibInstance = &Taglib{}
// 	return TaglibInstance
// }

// func (t *Taglib) Startup(ctx context.Context) {
// 	t.ctx = ctx
// 	_, _ = t.GetMetadataTaglib("/home/yuri/Data/music/The 1975 - Discography (2013-2020) (320)/2013 - The 1975/01 The 1975.mp3")
// }

func GetMetadataTaglib(path string) (Metadata, error) {
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

func findCoverInDirectory(path string) (*AlbumCover, error) {
	dir := filepath.Dir(path)
	commonCoverNames := []string{
		"cover.jpg", "cover.jpeg", "cover.png",
		"album.jpg", "album.jpeg", "album.png",
		"folder.jpg", "folder.jpeg", "folder.png",
		"artwork.jpg", "artwork.jpeg", "artwork.png",
		"front.jpg", "front.jpeg", "front.png",
	}

	for _, filename := range commonCoverNames {
		coverPath := filepath.Join(dir, filename)
		if _, err := os.Stat(coverPath); err == nil {
			data, err := os.ReadFile(coverPath)
			if err != nil {
				continue
			}

			mimeType := "image/jpeg"
			if filepath.Ext(coverPath) == ".png" {
				mimeType = "image/png"
			}

			return &AlbumCover{
				Data:     data,
				MimeType: mimeType,
			}, nil
		}
	}

	return nil, fmt.Errorf("no cover image found in directory: %s", dir)
}

func GetAlbumCover(path string) (*AlbumCover, error) {
	cpath := C.CString(path)
	defer C.free(unsafe.Pointer(cpath))

	fp := C.taglib_file_new(cpath)
	if fp == nil {
		return nil, fmt.Errorf("❌ failed to open file: %s", path)
	}
	defer C.taglib_file_free(fp)

	pictureProps := C.taglib_complex_property_get(fp, C.CString("PICTURE"))
	if pictureProps != nil {
		defer C.taglib_complex_property_free(pictureProps)

		var picData C.TagLib_Complex_Property_Picture_Data
		C.taglib_picture_from_complex_property(pictureProps, &picData)

		cover := &AlbumCover{
			MimeType: C.GoString(picData.mimeType),
		}

		// Copy binary data
		if picData.size > 0 {
			cover.Data = C.GoBytes(unsafe.Pointer(picData.data), C.int(picData.size))
		}

		return cover, nil
	}

	return findCoverInDirectory(path)
}
