package main

import (
	"context"
	"embed"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"

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

func clearWebKitData(appName string) error {
	cacheDir := filepath.Join(os.Getenv("HOME"), ".cache", appName)

	if err := os.RemoveAll(cacheDir); err != nil && !os.IsNotExist(err) {
		return fmt.Errorf("failed to remove cache dir: %v", err)
	}

	return nil
}

func main() {
	// Set locale for taglib
	os.Setenv("LC_NUMERIC", "C")
	os.Setenv("GDK_BACKEND", "x11")
	os.Setenv("JSC_SIGNAL_FOR_GC", "SIGUSR2")
	appName := "croaqui"

	// Try to run your Wails binary
	cmd := exec.Command("./" + appName)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	err := cmd.Run()
	if err != nil {
		fmt.Println("App failed to start, clearing WebKit cache...")
		if err := clearWebKitData(appName); err != nil {
			fmt.Println("Failed to clear cache:", err)
		} else {
			fmt.Println("Cache cleared. Try running the app again.")
		}
	}
	// Create an instance of the app structure
	player := player.MPV()
	media := media.NewMedia()
	data := db.NewDB()
	playlists := playlist.NewPlaylist()
	queue := queue.NewQueue()
	app := app.New()
	mpris := mpris.NewMprisInstance()

	err = wails.Run(&options.App{
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
