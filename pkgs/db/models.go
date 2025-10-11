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
	Duration string
	Genre    string
	Date     string
}
type Directory struct {
	gorm.Model
	ID         uint `gorm:"primaryKey"`
	Name       string
	Path       string
	Depth      int
	ParentPath string
}
