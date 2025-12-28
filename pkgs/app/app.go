package app

import (
	"context"

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
