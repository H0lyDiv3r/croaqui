package main

import (
	"context"
	"embed"
	"myproject/pkgs/db"
	"myproject/pkgs/ffmpeg"
	"myproject/pkgs/media"
	"myproject/pkgs/player"
	"myproject/pkgs/playlist"
	"myproject/pkgs/queue"
	"myproject/pkgs/taglib"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	player := player.MPV()
	media := media.NewMedia()
	data := db.NewDB()
	ffmpeg := ffmpeg.NewFFmpeg()
	playlists := playlist.NewPlaylist()
	taglib := taglib.NewTaglib()
	queue := queue.NewQueue()
	// Create application with options
	err := wails.Run(&options.App{
		Title: "Croaqui",

		Width:     768,
		Height:    768,
		MinWidth:  768,
		MinHeight: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup: func(ctx context.Context) {
			data.StartUp(ctx)
			media.StartUp(ctx)
			ffmpeg.StartUp(ctx)
			player.StartUp(ctx)
			playlists.StartUp(ctx)
			taglib.Startup(ctx)
			queue.StartUp(ctx)

		},
		Bind: []interface{}{
			media,
			player,
			playlists,
			queue,
			// ffmpeg,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
