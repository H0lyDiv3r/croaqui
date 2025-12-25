package db

import (
	"context"
	"fmt"
	"log"
	"os"
	"path/filepath"

	"github.com/H0lyDiv3r/croaqui/internals/taglib"
	customErr "github.com/H0lyDiv3r/croaqui/pkgs/error"

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

	homeDir, err := os.UserHomeDir()
	if err != nil {
		log.Fatal("failed to read Home dir")
		return
	}

	filename := filepath.Join(homeDir, ".config", "share", "croaqui")

	if err = os.MkdirAll(filename, 0755); err != nil {
		log.Fatal("failed to create database")
		return
	}

	dataBase, err := gorm.Open(sqlite.Open(filepath.Join(filename, "croaqui.db")), &gorm.Config{})
	if err != nil {
		emitter := customErr.New("db_error", err.Error())
		emitter.Emit(ctx)
		return
	}
	d.Instance = dataBase
	_ = dataBase.AutoMigrate(&MusicMetaData{})
	_ = dataBase.AutoMigrate(&MusicFile{})
	_ = dataBase.AutoMigrate(&Directory{})
	_ = dataBase.AutoMigrate(&Playlist{})
	_ = dataBase.AutoMigrate(&PlaylistMusic{})

}

func (d *DB) WriteAudioData(path string) error {

	var exists bool
	metadata, err := taglib.GetMetadataTaglib(path)
	if err != nil {

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
		return fmt.Errorf("file already exists")
	}
	result := d.Instance.Create(&MusicFile{Name: filepath.Base(path), Path: path, ParentPath: filepath.Dir(path), MetaData: musicMetadata})

	if result.Error != nil {
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
		return fmt.Errorf("dir already exists")
	}
	result := d.Instance.Create(&data)
	if result.Error != nil {
		return result.Error
	}
	return nil
}
