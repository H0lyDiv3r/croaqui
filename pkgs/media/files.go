package media

import (
	"bufio"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/H0lyDiv3r/croaqui/pkgs/db"
	customErr "github.com/H0lyDiv3r/croaqui/pkgs/error"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"gorm.io/gorm"
)

func (m *Media) GetContents(path string) (*ReturnType, error) {
	contents, err := os.ReadDir(path)
	if err != nil {
		emitter := customErr.New("file_error", fmt.Errorf("failed to read directory:%w", err).Error())
		emitter.Emit(m.ctx)
		return nil, err
	}
	var dirs []string
	for _, content := range contents {
		if content.IsDir() {
			fmt.Println("heeey", content)
			dirs = append(dirs, content.Name())
		}
	}
	return &ReturnType{Data: DirectoryContents{Content: dirs}}, nil
}

func (m *Media) GetStandardDirs() *ReturnType {

	type dir struct {
		Name string `json:"name"`
		Path string `json:"path"`
	}
	home, err := os.UserHomeDir()
	if err != nil {
		return &ReturnType{
			Data: struct {
				Dirs []dir `json:"dirs"`
			}{
				Dirs: []dir{},
			},
		}
	}
	xdgfile := filepath.Join(home, ".config", "user-dirs.dirs")

	//nolint:gosec
	file, err := os.Open(xdgfile)
	if err != nil {
		return &ReturnType{
			Data: struct {
				Dirs []dir `json:"dirs"`
			}{
				Dirs: []dir{},
			},
		}
	}
	defer func() {
		_ = file.Close()
	}()

	scanner := bufio.NewScanner(file)

	var StandardDirs []dir
	for scanner.Scan() {
		if strings.HasPrefix(scanner.Text(), "#") {
			continue
		}
		if strings.HasPrefix(scanner.Text(), "XDG") {
			path := strings.TrimSpace(strings.Split(scanner.Text(), "=")[1])
			if len(path) < 2 {
				continue
			}
			pathName := strings.Trim(strings.Split(path, "/")[len(strings.Split(path, "/"))-1], "\"")
			StandardDirs = append(StandardDirs, dir{Name: pathName, Path: strings.Trim(strings.Replace(path, "$HOME", home, 1), "\"")})
		}
	}

	return &ReturnType{
		Data: struct {
			Dirs []dir `json:"dirs"`
		}{
			Dirs: StandardDirs,
		},
	}
}

func (m *Media) GetDirs(path string) (*ReturnType, error) {
	type dirs []struct {
		Id    int    `json:"id"`
		Name  string `json:"name"`
		Path  string `json:"path"`
		Depth int    `json:"depth"`
	}
	var result dirs

	//find the smallest depth starting with path
	res := db.DBInstance.Instance.Raw(`
		SELECT id,name,path,depth,parent_path pp FROM directories d
		WHERE pp LIKE ? AND depth = (
			SELECT MIN(depth) FROM directories d1
				WHERE d1.parent_path LIKE ?
		)
		`, path+"%", path+"%").Scan(&result)

	if res.Error != nil {
		emitter := customErr.New("db_error", fmt.Errorf("failed to fetch directories:%w", res.Error).Error())
		emitter.Emit(m.ctx)
		return nil, res.Error
	}
	return &ReturnType{Data: struct {
		Dirs dirs `json:"dirs"`
	}{Dirs: result}}, nil
}

func (m *Media) RemoveDir(path string) error {

	return db.DBInstance.Instance.Transaction(func(tx *gorm.DB) error {

		if err := tx.Exec(`
			DELETE FROM directories WHERE path LIKE ?
			`, path+"%").Error; err != nil {
			runtime.EventsEmit(m.ctx, "toast:err", "Directory removed successfully")
			return err
		}

		if err := tx.Exec(`
			DELETE FROM directories WHERE path LIKE ?
			`, path+"%").Error; err != nil {
			runtime.EventsEmit(m.ctx, "toast:err", "Directory removed successfully")
			return err
		}

		runtime.EventsEmit(m.ctx, "toast:success", "Directory removed successfully")
		return nil
	})
}
