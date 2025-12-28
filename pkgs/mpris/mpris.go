package mpris

import (
	"context"
	"fmt"

	"github.com/H0lyDiv3r/croaqui/pkgs/sharedTypes"
	"github.com/godbus/dbus/v5"
	"github.com/godbus/dbus/v5/introspect"
	"github.com/godbus/dbus/v5/prop"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type Mpris struct {
	ctx              context.Context
	conn             *dbus.Conn
	prop             *prop.Prop
	execChan         chan Command
	AlbumArtUrl      string
	playerController PlayerController
}

type PlayerController interface {
	TogglePlay() (*sharedTypes.ReturnType, error)
}

type Command struct {
	Command    func()
	ReturnChan chan interface{}
}

var MprisInstance *Mpris

func NewMprisInstance() *Mpris {
	MprisInstance = &Mpris{}
	return MprisInstance

}

type MpriPlayer struct {
	Playing bool
	ctx     context.Context
}

func (m *Mpris) Startup(ctx context.Context, playerController PlayerController) {
	m.ctx = ctx
	m.playerController = playerController
	m.execChan = make(chan Command, 10)

	conn, err := dbus.SessionBus()
	if err != nil {
		fmt.Println("Failed to connect:", err)
		return
	}
	m.conn = conn

	reply, err := conn.RequestName("org.mpris.MediaPlayer2.Croaqui", dbus.NameFlagReplaceExisting)
	if err != nil {
		fmt.Println("Failed to request name:", err)
		return
	}
	if reply != dbus.RequestNameReplyPrimaryOwner {
		fmt.Println("Name already taken")
		return
	}

	player := &MpriPlayer{
		Playing: false,
		ctx:     ctx,
	}

	conn.Export(player, "/org/mpris/MediaPlayer2", "org.mpris.MediaPlayer2.Player")

	node := &introspect.Node{
		Name: "/org/mpris/MediaPlayer2",
		Interfaces: []introspect.Interface{
			{
				Name: "org.mpris.MediaPlayer2.Player",
				Methods: []introspect.Method{
					{Name: "Play"},
					{Name: "Pause"},
					{Name: "Stop"},
					{Name: "Next"},
					{Name: "Previous"},
					{Name: "Seek"},
					{Name: "SetPosition"},
					{Name: "OpenUri"},
				},
			},
		},
	}

	conn.Export(introspect.NewIntrospectable(node), "/org/mpris/MediaPlayer2", "org.freedesktop.Dbus.Introspectable")
	go m.ExecutionLoop()
}

func (m *Mpris) ExecutionLoop() {
	for {
		select {
		case <-m.ctx.Done():
			return
		case cmd := <-m.execChan:
			cmd.Command()
			cmd.ReturnChan <- struct{}{}
		}
	}
}

func (m *Mpris) SetAlbumArtUrl(url string) {
	m.AlbumArtUrl = url
}

func (m *Mpris) EmitPropertiesChanged(p map[string]dbus.Variant) {

	returnChan := make(chan interface{})

	MprisInstance.execChan <- Command{
		Command: func() {
			m.conn.Emit(
				dbus.ObjectPath("/org/mpris/MediaPlayer2"),
				"org.freedesktop.DBus.Properties.PropertiesChanged",
				"org.mpris.MediaPlayer2.Player",
				p,
				[]string{},
			)
		},
		ReturnChan: returnChan,
	}
	<-returnChan
}

func (mp *MpriPlayer) PlayPause() *dbus.Error {
	playStat, _ := MprisInstance.playerController.TogglePlay()

	if stat, ok := playStat.Data.(struct {
		Paused   bool    `json:"paused"`
		Position float64 `json:"position"`
	}); ok {
		fmt.Println("coming deom olay pause")

		runtime.EventsEmit(mp.ctx, "MPRIS", struct {
			Type   string `json:"type"`
			Action any    `json:"action"`
		}{Type: "playpause", Action: stat.Paused})
	}
	return nil
}

func (mp *MpriPlayer) Next() *dbus.Error {

	runtime.EventsEmit(mp.ctx, "MPRIS", struct {
		Type   string `json:"type"`
		Action any    `json:"action"`
	}{Type: "next", Action: struct{}{}})
	return nil
}

func (mp *MpriPlayer) Previous() *dbus.Error {

	runtime.EventsEmit(mp.ctx, "MPRIS", struct {
		Type   string `json:"type"`
		Action any    `json:"action"`
	}{Type: "previous", Action: struct{}{}})
	return nil
}

func (m *Mpris) OnShutdown() {
	m.conn.Close()
}
