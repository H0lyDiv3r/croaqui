package main

import (
	"context"
	"embed"
	"os"

	"github.com/H0lyDiv3r/croaqui/pkgs/app"
	"github.com/H0lyDiv3r/croaqui/pkgs/db"
	"github.com/H0lyDiv3r/croaqui/pkgs/media"
	"github.com/H0lyDiv3r/croaqui/pkgs/mpris"
	"github.com/H0lyDiv3r/croaqui/pkgs/player"
	"github.com/H0lyDiv3r/croaqui/pkgs/playlist"
	"github.com/H0lyDiv3r/croaqui/pkgs/queue"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/linux"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Set locale for taglib
	os.Setenv("LC_NUMERIC", "C")

	// Create an instance of the app structure
	player := player.MPV()
	media := media.NewMedia()
	data := db.NewDB()
	playlists := playlist.NewPlaylist()
	queue := queue.NewQueue()
	app := app.New()
	mpris := mpris.NewMprisInstance()

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
			player.StartUp(ctx)
			playlists.StartUp(ctx)
			queue.StartUp(ctx)
			app.StartUp(ctx)
			mpris.Startup(ctx, player)

		},
		Bind: []interface{}{
			media,
			player,
			playlists,
			queue,
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
