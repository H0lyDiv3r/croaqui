package queue

import (
	"context"

	"fmt"
	"math/rand"
	"myproject/pkgs/db"
	customErr "myproject/pkgs/error"
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

	q.GetQueue(filter{Type: "playlist", Args: "1", Shuffle: true})
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

	fmt.Println("this is by playlist", res)

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
	for i := len(*a) - 1; i > 0; i-- {
		j := rand.Intn(i + 1)

		b[i], b[j] = b[j], b[i]

	}

}
