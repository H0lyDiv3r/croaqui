package main

import (
	"context"
	"embed"
	"myproject/pkgs/db"
	"myproject/pkgs/dir"
	"myproject/pkgs/ffmpeg"
	"myproject/pkgs/player"

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
	dir := dir.NewDirectory()
	data := db.NewDB()
	ffmpeg := ffmpeg.NewFFmpeg()

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "Croaky",
		Width:  1024,
		Height: 1024,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup: func(ctx context.Context) {
			app.startup(ctx)
			player.StartUp(ctx)
			dir.StartUp(ctx)
			data.StartUp(ctx)
			ffmpeg.StartUp(ctx)

		},
		Bind: []interface{}{
			app,
			player,
			dir,
			// ffmpeg,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
