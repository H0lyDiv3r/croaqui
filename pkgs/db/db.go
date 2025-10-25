package db

import (
	"context"
	"fmt"
	"log"
	"myproject/pkgs/taglib"
	"path/filepath"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type DB struct {
	ctx      context.Context
	Instance *gorm.DB
}

var DBInstance *DB

func NewDB() *DB {
	DBInstance = &DB{}
	return DBInstance
}

func (d *DB) StartUp(ctx context.Context) {
	d.ctx = ctx
	dataBase, err := gorm.Open(sqlite.Open("/home/yuri/Data/projects/music-player-go/test-files/test.db"), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	d.Instance = dataBase
	dataBase.AutoMigrate(&MusicMetaData{})
	dataBase.AutoMigrate(&MusicFile{})
	dataBase.AutoMigrate(&Directory{})
	dataBase.AutoMigrate(&Playlist{})
	dataBase.AutoMigrate(&PlaylistMusic{})
	// d.Instance.Create(&Playlist{Name: "favorites"})

	log.Print("DB startup")
}

func (d *DB) WriteAudioData(path string) error {

	var exists bool
	metadata, err := taglib.TaglibInstance.GetMetadataTaglib(path)
	if err != nil {
		fmt.Println("Error getting metadata:", err)
		return err
	}
	format := metadata.Format
	musicMetadata := MusicMetaData{
		Title:    format.Tags.Title,
		Artist:   format.Tags.Artist,
		Album:    format.Tags.Album,
		Duration: format.Duration,
		Genre:    format.Tags.Genre,
		Date:     format.Tags.Date,
	}
	d.Instance.Raw(`
	SELECT EXISTS(SELECT 1 FROM music_files m WHERE m.path = ? )
	`, path).Scan(&exists)
	if exists {
		log.Print("file already exists")
		return nil
	}
	result := d.Instance.Create(&MusicFile{Name: filepath.Base(path), Path: path, ParentPath: filepath.Dir(path), MetaData: musicMetadata})

	if result.Error != nil {
		fmt.Println("Error writing to database:", result.Error)
		return result.Error
	}
	return nil
}

func (d *DB) WriteDirData(data Directory) error {
	var exists bool
	d.Instance.Raw(`
		SELECT EXISTS(SELECT 1 FROM directories WHERE path = ?)
	`, data.Path).Scan(&exists)
	if exists {
		log.Print("dir already exists")
		return nil
	}
	result := d.Instance.Create(&data)
	if result.Error != nil {
		fmt.Println("Error writing to database:", result.Error)
		return result.Error
	}
	return nil
}
