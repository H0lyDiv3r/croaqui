package main

import (
	"context"
	"embed"
	"github.com/H0lyDiv3r/croaqui/pkgs/app"
	"github.com/H0lyDiv3r/croaqui/pkgs/db"
	"github.com/H0lyDiv3r/croaqui/pkgs/ffmpeg"
	"github.com/H0lyDiv3r/croaqui/pkgs/media"
	"github.com/H0lyDiv3r/croaqui/pkgs/player"
	"github.com/H0lyDiv3r/croaqui/pkgs/playlist"
	"github.com/H0lyDiv3r/croaqui/pkgs/queue"
	"github.com/H0lyDiv3r/croaqui/pkgs/taglib"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/linux"
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
	app := app.New()
	// Create application with options
	//
	//

	err := wails.Run(&options.App{
		Title: "Croaqui",

		Width:            768,
		Height:           768,
		MinWidth:         768,
		MinHeight:        768,
		Frameless:        true,
		BackgroundColour: &options.RGBA{R: 0, G: 0, B: 0, A: 0},
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		Linux: &linux.Options{
			WindowIsTranslucent: true,
		},
		OnStartup: func(ctx context.Context) {
			data.StartUp(ctx)
			media.StartUp(ctx)
			ffmpeg.StartUp(ctx)
			player.StartUp(ctx)
			playlists.StartUp(ctx)
			taglib.Startup(ctx)
			queue.StartUp(ctx)
			app.StartUp(ctx)

		},
		Bind: []interface{}{
			media,
			player,
			playlists,
			queue,
			app,
			// ffmpeg,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
