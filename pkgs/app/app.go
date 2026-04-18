package app

import (
	"context"
	"fmt"
	"os"
	"path/filepath"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type screenSize struct {
	height int
	width  int
}

type app struct {
	ctx        context.Context
	screenSize screenSize
}

func New() *app {
	return &app{}
}

func (a *app) StartUp(ctx context.Context) {

	if crashedPreviously() {
		_ = clearWebKitData("croaqui")
	}

	a.ctx = ctx
	screens, err := runtime.ScreenGetAll(a.ctx)
	if err != nil {
		a.screenSize = screenSize{
			height: 768,
			width:  768,
		}

	}
	for _, screen := range screens {
		if screen.IsPrimary {
			a.screenSize = screenSize{
				height: screen.PhysicalSize.Height,
				width:  screen.PhysicalSize.Width,
			}
			break
		}
	}
}

func (a *app) OpenMiniPlayer() {
	runtime.WindowUnmaximise(a.ctx)
	runtime.WindowSetMaxSize(a.ctx, 512, 120)
	runtime.WindowSetMinSize(a.ctx, 512, 120)
	runtime.WindowSetSize(a.ctx, 512, 96)
	runtime.WindowSetPosition(a.ctx, a.screenSize.width, a.screenSize.height)
	runtime.WindowSetAlwaysOnTop(a.ctx, true)
}

func (a *app) MinimizeApp() {
	runtime.WindowUnmaximise(a.ctx)
	runtime.WindowMinimise(a.ctx)
}

func (a *app) MaximizeApp() {
	runtime.WindowSetMinSize(a.ctx, 768, 768)
	runtime.WindowSetMaxSize(a.ctx, a.screenSize.width, a.screenSize.height)
	runtime.WindowMaximise(a.ctx)
	runtime.WindowSetAlwaysOnTop(a.ctx, false)
}

func clearWebKitData(appName string) error {
	if appName == "" {
		return fmt.Errorf("appName cannot be empty")
	}

	home, err := os.UserHomeDir()
	if err != nil {
		return fmt.Errorf("failed to get home dir: %w", err)
	}

	paths := []string{
		filepath.Join(home, ".cache", "webkitgtk"),
		filepath.Join(home, ".local", "share", "webkitgtk"),

		filepath.Join(home, ".cache", "WebKit"),
		filepath.Join(home, ".local", "share", "WebKit"),

		filepath.Join(home, ".cache", appName),
	}

	var firstErr error

	for _, p := range paths {
		if err := os.RemoveAll(p); err != nil && !os.IsNotExist(err) {
			if firstErr == nil {
				firstErr = fmt.Errorf("failed removing %s: %w", p, err)
			}
		}
	}

	return firstErr
}

func crashedPreviously() bool {
	home, _ := os.UserHomeDir()
	marker := filepath.Join(home, ".local", "share", "croaqui", "clean_shutdown.ok")

	_, err := os.Stat(marker)
	return err != nil
}
