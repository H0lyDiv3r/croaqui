package playlist

import (
	"context"
	"errors"
	"fmt"
	"log"
	"myproject/pkgs/db"
	customErr "myproject/pkgs/error"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type Playlist struct {
	ctx context.Context
}
type ReturnType struct {
	Data interface{} `json:"data"`
}

type song struct {
	// Id       int    `json:"id"`
	Pname    string `json:"pname"`
	Id       uint   `json:"id"`
	Name     string `json:"name"`
	Path     string `json:"path"`
	Title    string `json:"title"`
	Artist   string `json:"artist"`
	Album    string `json:"album"`
	Duration string `json:"duration"`
	Genre    string `json:"genre"`
	Position int    `json:"position"`
}

type playlist struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
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

	var playlists []playlist
	db.DBInstance.Instance.Raw(`
		SELECT * from playlists WHERE deleted_at IS NULL
		`).Scan(&playlists)

	return &ReturnType{Data: struct {
		Playlists []playlist `json:"playlists"`
	}{Playlists: playlists}}
}

// add to playlist
func (p *Playlist) AddToPlaylist(musicId, playlistId uint) (*ReturnType, error) {
	var res uint
	db.DBInstance.Instance.Raw(`
		SELECT COUNT(id) FROM playlist_musics pm
		WHERE pm.playlist_id = ?
		`, playlistId).Scan(&res)

	var playListExists int
	db.DBInstance.Instance.Raw(`
		SELECT EXISTS(SELECT 1 FROM playlists p
		WHERE p.id = ?)
		`, playlistId).Scan(&playListExists)

	if playListExists == 0 {
		emitter := customErr.New("db_error", fmt.Errorf("selected playlist does not exist").Error())
		emitter.Emit(p.ctx)
		return nil, errors.New("playlist does not exist")
	}

	var musicExists int
	db.DBInstance.Instance.Raw(`
		SELECT EXISTS(SELECT 1 FROM music_files m
		WHERE m.id = ?)
		`, musicId).Scan(&musicExists)

	if musicExists == 0 {
		emitter := customErr.New("db_error", fmt.Errorf("selected music does not exist").Error())
		emitter.Emit(p.ctx)
		return nil, errors.New("music does not exist")
	}

	result := db.DBInstance.Instance.Create(&db.PlaylistMusic{PlaylistID: playlistId, Position: res + 1, MusicID: musicId})
	if result.Error != nil {
		log.Print("Error adding to playlist:", result.Error)
		emitter := customErr.New("db_error", fmt.Errorf("failed to add to playlist:%w", result.Error).Error())
		emitter.Emit(p.ctx)
		return nil, result.Error
	}
	p.Emit("Added to Playlist")
	return &ReturnType{Data: struct {
		PlaylistId uint `json:"playlistId"`
	}{PlaylistId: playlistId}}, nil
}

// remove from playlist
func (p *Playlist) RemoveFromPlaylist(musicId, playlistId uint) (*ReturnType, error) {
	var playListExists int
	db.DBInstance.Instance.Raw(`
		SELECT EXISTS(SELECT 1 FROM playlists p
		WHERE p.id = ?)
		`, playlistId).Scan(&playListExists)

	if playListExists == 0 {
		emitter := customErr.New("db_error", fmt.Errorf("selected playlist does not exist").Error())
		emitter.Emit(p.ctx)
		return nil, errors.New("playlist does not exist")
	}

	var musicExists int
	db.DBInstance.Instance.Raw(`
		SELECT EXISTS(SELECT 1 FROM playlist_musics pm
		WHERE pm.music_id = ?)
		`, musicId).Scan(&musicExists)

	if musicExists == 0 {
		emitter := customErr.New("db_error", fmt.Errorf("selected music does not exist").Error())
		emitter.Emit(p.ctx)
		return nil, errors.New("music does not exist")
	}

	log.Print("song removed from playlist", playlistId, musicId)
	result := db.DBInstance.Instance.Where("playlist_id = ? AND music_id = ?", playlistId, musicId).Delete(&db.PlaylistMusic{})
	if result.Error != nil {
		log.Print("Error removing from playlist:", result.Error)
		emitter := customErr.New("db_error", fmt.Errorf("failed to Remove from playlist:%w", result.Error).Error())
		emitter.Emit(p.ctx)
		return nil, result.Error
	}

	p.Emit("Removed from Playlist")
	return &ReturnType{Data: struct {
		SongId uint `json:"songId"`
	}{SongId: musicId}}, nil
}

// create playlist
func (p *Playlist) CreatePlaylist(name string) (*ReturnType, error) {
	if name == "" {
		emitter := customErr.New("db_error", "name cannot be empty")
		emitter.Emit(p.ctx)
		return nil, errors.New("name cannot be empty")
	}

	pl := db.Playlist{
		Name: name,
	}
	result := db.DBInstance.Instance.Create(&pl)
	if result.Error != nil {
		log.Print("Error creating playlist:", result.Error)
		emitter := customErr.New("db_error", fmt.Errorf("failed to create playlist:%w", result.Error).Error())
		emitter.Emit(p.ctx)
		return nil, result.Error
	}

	p.Emit("Playlist created")
	return &ReturnType{
		Data: struct {
			Playlist db.Playlist `json:"playlist"`
		}{
			Playlist: pl,
		},
	}, nil
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

	var songs []song
	db.DBInstance.Instance.Raw(`
		SELECT pm.*,p.name as pname,m.id, m.name,m.path,mm.title,mm.artist,mm.album,mm.duration,mm.genre FROM playlist_musics pm
		LEFT JOIN playlists p ON pm.playlist_id = p.id
		LEFT JOIN music_files m ON pm.music_id = m.id
		LEFT JOIN music_meta_data mm ON m.meta_data_id = mm.id
		WHERE p.id = ?
		AND pm.deleted_at IS NULL
		`, id).Scan(&songs)

	return &ReturnType{Data: struct {
		Songs []song `json:"songs"`
	}{Songs: songs}}
}

// delete playlist
func (p *Playlist) DeletePlaylist(id uint) (*ReturnType, error) {

	result := db.DBInstance.Instance.Delete(&db.Playlist{}, id)
	if result.Error != nil {
		emitter := customErr.New("db_error", fmt.Errorf("failed to delete playlist:%w", result.Error).Error())
		emitter.Emit(p.ctx)
		return nil, result.Error
	}

	p.Emit("Playlist deleted")
	return &ReturnType{Data: struct {
		Playlist uint `json:"playlist"`
	}{Playlist: id}}, nil
}

func (p *Playlist) Emit(msg string) {
	runtime.EventsEmit(p.ctx, "toast:success", msg)
}
