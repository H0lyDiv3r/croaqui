package media

import (
	"encoding/json"
	"fmt"
	"myproject/pkgs/db"
)

type Album struct {
	Path     string `json:"path"`
	Album    string `json:"album"`
	Artist   string `json:"artist"`
	Duration string `json:"duration"`
	Image    string `json:"image"`
	Songs    int    `json:"songs"`
}

type counts struct {
	Artists int `json:"artists"`
	Albums  int `json:"albums"`
}

type filterData struct {
	Limit  int    `json:"limit"`
	Page   int    `json:"offset"`
	Artist string `json:"artist"`
}

func (m *Media) GetAlbums(filters string) (*ReturnType, error) {

	var result struct {
		Albums []Album `json:"albums"`
		Counts counts  `json:"counts"`
	}

	var filterSettings filterData

	err := json.Unmarshal([]byte(filters), &filterSettings)
	if err != nil {
		return nil, err
	}
	// db.DBInstance.Instance.Raw(`
	// SELECT path,album,artist,SUM(duration) AS duration,COUNT(m.id) AS songs FROM music_files m
	// LEFT JOIN music_meta_data mm ON m.meta_data_id = mm.id

	// GROUP BY album
	// `)

	query := db.DBInstance.Instance.Table("music_files as m").Select("path, album, artist, SUM(duration) AS duration, COUNT(m.id) AS songs").Joins(`LEFT JOIN music_meta_data mm ON m.meta_data_id = mm.id`).Group("album")

	if filterSettings.Artist != "" {
		query.Where("artist = ?", filterSettings.Artist)
	}

	var count int64
	query.Count(&count)
	offset := filterSettings.Page * filterSettings.Limit
	if filterSettings.Limit > 0 {
		query = query.Limit(filterSettings.Limit)
		query = query.Offset(offset)
	}

	query.Count(&count)
	query.Scan(&result.Albums)

	// db.DBInstance.Instance.Raw(`
	// SELECT COUNT(DISTINCT artist) AS artists,COUNT(DISTINCT album) AS albums FROM music_files m
	// LEFT JOIN music_meta_data mm ON m.meta_data_id = mm.id
	// `)
	query2 := db.DBInstance.Instance.Table("music_files as m").Select("COUNT(DISTINCT mm.artist) AS artists, COUNT(DISTINCT mm.album) AS albums").Joins("LEFT JOIN music_meta_data mm ON m.meta_data_id = mm.id")
	if filterSettings.Artist != "" {
		query2.Where("artist = ?", filterSettings.Artist)
	}
	query2.Scan(&result.Counts)

	return &ReturnType{
		Data: struct {
			Albums  []Album `json:"albums"`
			Counts  counts  `json:"counts"`
			HasMore bool    `json:"hasMore"`
		}{Albums: result.Albums, Counts: result.Counts, HasMore: offset+filterSettings.Limit < int(result.Counts.Albums)},
	}, nil
}

func (m *Media) GetAlbumData(album string) (*ReturnType, error) {
	var result Album
	db.DBInstance.Instance.Raw(`
		SELECT album,artist,SUM(duration) AS duration,COUNT(m.id) AS songs FROM music_files m
		LEFT JOIN music_meta_data mm ON m.meta_data_id = mm.id
		WHERE album = ?
	`, album).Scan(&result)

	return &ReturnType{
		Data: struct {
			AlbumInfo Album `json:"albumInfo"`
		}{AlbumInfo: result},
	}, nil

}

func (m *Media) GetAlbumImage(album string) (*ReturnType, error) {

	var result []Album
	db.DBInstance.Instance.Raw(`
	SELECT path,album FROM music_files m
	LEFT JOIN music_meta_data mm ON m.meta_data_id = mm.id
	WHERE album = ?
	`, album).Scan(&result)

	for _, item := range result {

		// img, err := fetchImage(item.Path)
		// if err != nil {
		// 	fmt.Println("error fetching image", err)
		// 	result[idx].Image = fmt.Sprintf("%s/%s", item.Path, "cover.jpg")
		// 	continue
		// }
		// result[idx].Image = img
		if item.Album == "unknown" {
			fmt.Println("album is unknown")
			continue
		}
		img, err := FetchImage(item.Path)
		if err != nil {
			fmt.Println("error fetching image", err)
			continue
		}

		if img != "" {
			return &ReturnType{
				Data: struct {
					Image string `json:"image"`
				}{
					Image: img,
				},
			}, nil
		}
	}

	return &ReturnType{
		Data: struct {
			Image string `json:"image"`
		}{
			Image: "",
		},
	}, nil
}
