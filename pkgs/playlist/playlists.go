package playlist

import (
	"context"
	"errors"
	"fmt"
	"log"
	"myproject/pkgs/db"
)

type Playlist struct {
	ctx context.Context
}
type ReturnType struct {
	Data interface{} `json:"data"`
}

func NewPlaylist() *Playlist {
	return &Playlist{}
}
func (p *Playlist) StartUp(ctx context.Context) {
	p.ctx = ctx
	p.GetPlaylist(4)
	// p.AddToPlaylist(2, 27)
	p.DeletePlaylist(4)
}

// read all playlists
func (p *Playlist) GetPlaylists() *ReturnType {

	type playlist struct {
		Id   int    `json:"id"`
		Name string `json:"name"`
	}
	var playlists []playlist
	db.DBInstance.Instance.Raw(`
		SELECT * from playlists
		`).Scan(&playlists)

	fmt.Println("this is it. this is", playlists)
	return &ReturnType{Data: struct {
		Playlists []playlist `json:"playlists"`
	}{Playlists: playlists}}
}

// add to playlist
func (p *Playlist) AddToPlaylist(musicId, playlistId uint) error {
	var res uint
	db.DBInstance.Instance.Raw(`
		SELECT COUNT(id) FROM playlist_musics pm
		WHERE pm.playlist_id = ?
		`, playlistId).Scan(&res)
	result := db.DBInstance.Instance.Create(&db.PlaylistMusic{PlaylistID: playlistId, Position: res + 1, MusicID: musicId})
	if result.Error != nil {
		log.Print("Error adding to playlist:", result.Error)
		return result.Error
	}
	return nil
}

// remove from playlist
func (p *Playlist) RemoveFromPlaylist(musicId, playlistId uint) error {
	result := db.DBInstance.Instance.Delete(&db.PlaylistMusic{PlaylistID: playlistId, MusicID: musicId})
	if result.Error != nil {
		log.Print("Error removing from playlist:", result.Error)
		return result.Error
	}
	return nil
}

// create playlist
func (p *Playlist) CreatePlaylist(name string) error {
	if name == "" {
		log.Print("can not create playlist")
		return errors.New("name cannot be empty")
	}
	result := db.DBInstance.Instance.Create(&db.Playlist{Name: name})
	if result.Error != nil {
		log.Print("Error creating playlist:", result.Error)
		return result.Error
	}
	return nil
}

// update playlist
func (p *Playlist) UpdatePlaylistName(id uint, newName string) error {
	if newName == "" {
		log.Print("can not update playlist name")
		return errors.New("new name cannot be empty")
	}
	db.DBInstance.Instance.Raw(`
	UPDATE playlists p
	SET p.name = ?
	WHERE p.id = ?
	`, newName, id)

	return nil
}

// read playlist
func (p *Playlist) GetPlaylist(id uint) *ReturnType {

	type song struct {
		// Id       int    `json:"id"`
		Pname    string `json:"pname"`
		Name     string `json:"name"`
		Path     string `json:"path"`
		Title    string `json:"title"`
		Artist   string `json:"artist"`
		Album    string `json:"album"`
		Duration string `json:"duration"`
		Genre    string `json:"genre"`
		Position int    `json:"position"`
	}
	var songs []song
	db.DBInstance.Instance.Raw(`
		SELECT pm.*,p.name as pname, m.* FROM playlist_musics pm
		LEFT JOIN playlists p ON pm.playlist_id = p.id
		LEFT JOIN music_files m ON pm.music_id = m.id
		LEFT JOIN music_meta_data mm ON m.meta_data_id = mm.id
		WHERE p.id = ?
		`, id).Scan(&songs)

	fmt.Println("im here im weir", songs)
	return &ReturnType{Data: struct {
		Songs []song `json:"songs"`
	}{Songs: songs}}
}

// delete playlist
func (p *Playlist) DeletePlaylist(id uint) error {
	result := db.DBInstance.Instance.Delete(&db.Playlist{}, id)
	if result.Error != nil {
		fmt.Println("error deleting playlist", result.Error)
		return result.Error
	}
	return nil
}
