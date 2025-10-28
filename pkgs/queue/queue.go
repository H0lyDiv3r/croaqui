package queue

import (
	"context"
	"encoding/json"
	"fmt"
	"math/rand"
	"myproject/pkgs/db"
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
	q.GetQueue("{\"type\":\"playlist\",\"args\":\"1\"}")
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

func (q *Queue) GetQueue(filters string) error {

	type filter struct {
		Type    string `json:"type"`
		Args    string `json:"args"`
		Shuffle bool   `json:"shuffle"`
	}

	var res []audio

	var filterSetting filter

	query := db.DBInstance.Instance.Table("music_files as m").Select("name,path,title,album,artist,date,duration,music_id,playlist_id").Joins("LEFT JOIN music_meta_data mm ON m.meta_data_id = mm.id")

	err := json.Unmarshal([]byte(filters), &filterSetting)
	if err != nil {
		return err
	}

	if filterSetting.Type == "dir" {
		query.Where("path LIKE ?", filterSetting.Args+"%")
	}

	if filterSetting.Type == "album" {
		query.Where("album = ?", filterSetting.Args)
	}

	if filterSetting.Type == "playlist" {
		query.Joins("LEFT JOIN playlist_musics pm ON m.id = pm.music_id ").Where("playlist_id = ?", filterSetting.Args)
	}

	query.Scan(&res)

	if filterSetting.Shuffle {
		q.shuffleQuery(&res)
	}

	fmt.Println("this is by playlist", res)
	return nil

}
func (q *Queue) shuffleQuery(a *[]audio) {

	b := *a
	for i := len(*a) - 1; i > 0; i-- {
		j := rand.Intn(i)

		b[i], b[j] = b[j], b[i]

	}

}
