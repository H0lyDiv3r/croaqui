package db

import "gorm.io/gorm"

type MusicFile struct {
	gorm.Model
	ID         uint `gorm:"primaryKey"`
	Name       string
	Path       string
	ParentPath string
	MetaDataID uint
	MetaData   MusicMetaData
}

type MusicMetaData struct {
	gorm.Model
	ID       uint `gorm:"primaryKey"`
	Title    string
	Artist   string
	Album    string
	Duration int
	Genre    string
	Date     int
}
type Directory struct {
	gorm.Model
	ID         uint `gorm:"primaryKey"`
	Name       string
	Path       string
	Depth      int
	ParentPath string
}

type Playlist struct {
	gorm.Model
	ID   uint `gorm:"primaryKey"`
	Name string
}

type PlaylistMusic struct {
	gorm.Model
	PlaylistID uint
	MusicID    uint
	Position   uint
}
