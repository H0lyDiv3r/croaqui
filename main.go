package main

import (
	"context"
	"embed"
	"myproject/pkgs/db"
	"myproject/pkgs/ffmpeg"
	"myproject/pkgs/media"
	"myproject/pkgs/player"
	"myproject/pkgs/playlist"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp()
	player := player.MPV()
	media := media.NewMedia()
	data := db.NewDB()
	ffmpeg := ffmpeg.NewFFmpeg()
	playlists := playlist.NewPlaylist()
	// Create application with options
	err := wails.Run(&options.App{
		Title:     "Croaky",
		Width:     1024,
		Height:    1024,
		MinWidth:  10,
		MinHeight: 10,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup: func(ctx context.Context) {
			app.startup(ctx)
			data.StartUp(ctx)
			media.StartUp(ctx)
			ffmpeg.StartUp(ctx)
			player.StartUp(ctx)
			playlists.StartUp(ctx)

		},
		Bind: []interface{}{
			app,
			media,
			player,
			playlists,
			// ffmpeg,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
