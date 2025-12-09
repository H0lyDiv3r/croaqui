package queue

import (
	"context"
	"crypto/rand"
	"fmt"
	"math"
	"math/big"
	"sync"

	"github.com/H0lyDiv3r/croaqui/pkgs/db"
	customErr "github.com/H0lyDiv3r/croaqui/pkgs/error"
)

type Queue struct {
	ctx context.Context
}

func NewQueue() *Queue {
	return &Queue{}
}

func (q *Queue) StartUp(ctx context.Context) {
	q.ctx = ctx
	// q.Shuffle()

	_, _ = q.GetQueue(filter{Type: "playlist", Args: "1", Shuffle: true})
}

type audio struct {
	Id       int    `json:"id"`
	Name     string `json:"name"`
	Path     string `json:"path"`
	Title    string `json:"title"`
	Artist   string `json:"artist"`
	Album    string `json:"album"`
	Duration string `json:"duration"`
}

type ReturnType struct {
	Data interface{} `json:"data"`
}
type filter struct {
	Type    string `json:"type"`
	Args    string `json:"args"`
	Shuffle bool   `json:"shuffle"`
}

func (q *Queue) GetQueue(filterSetting filter) (*ReturnType, error) {

	var res []audio

	// var filterSetting filter

	fmt.Println("filter setting", filterSetting)

	query := db.DBInstance.Instance.Table("music_files as m").Select("name,path,title,album,artist,date,duration").Joins("LEFT JOIN music_meta_data mm ON m.meta_data_id = mm.id")

	// err := json.Unmarshal([]byte(filters), &filterSetting)
	// if err != nil {
	// 	return err
	// }

	if filterSetting.Type == "dir" {
		query.Where("path LIKE ?", filterSetting.Args+"%")
	}

	if filterSetting.Type == "album" {
		query.Where("album = ?", filterSetting.Args)
	}

	if filterSetting.Type == "playlist" {

		query.Joins("LEFT JOIN playlist_musics pm ON m.id = pm.music_id ").Where("pm.playlist_id = ?", filterSetting.Args)
	}

	if query.Error != nil {
		emitter := customErr.New("db_error", fmt.Errorf("failed to create queue:%w", query.Error).Error())
		emitter.Emit(q.ctx)

		return nil, query.Error
	}

	query.Scan(&res)

	if filterSetting.Shuffle {
		q.shuffleQuery(&res)
	}

	return &ReturnType{
		Data: struct {
			Queue []audio `json:"queue"`
		}{
			Queue: res,
		},
	}, nil

}
func (q *Queue) shuffleQuery(a *[]audio) {
	b := *a
	perRoutineAmount := 100
	routineCount := math.Floor(float64(len(b) / perRoutineAmount))
	var wg sync.WaitGroup

	for i := 0; i < int(routineCount+1); i++ {
		wg.Add(1)
		if i >= int(routineCount) {
			go shuffleWorker(b[(i*perRoutineAmount):], &wg)
		} else {
			go shuffleWorker(b[(i*perRoutineAmount):((i+1)*perRoutineAmount)-1], &wg)
		}

	}
	wg.Wait()
}

func shuffleWorker(a []audio, wg *sync.WaitGroup) {
	defer wg.Done()
	for i := len(a) - 1; i > 0; i-- {
		randBig, _ := rand.Int(rand.Reader, big.NewInt(int64(i+1)))
		j := int(randBig.Int64())

		a[i], a[j] = a[j], a[i]
	}
}
