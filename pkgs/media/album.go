package media

import (
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

func (m *Media) GetAlbums() (*ReturnType, error) {

	type counts struct {
		Artists int `json:"artists"`
		Albums  int `json:"albums"`
	}

	var result struct {
		Albums []Album `json:"albums"`
		Counts counts  `json:"counts"`
	}

	db.DBInstance.Instance.Raw(`
	SELECT path,album,artist,SUM(duration) AS duration,COUNT(m.id) AS songs FROM music_files m
	LEFT JOIN music_meta_data mm ON m.meta_data_id = mm.id

	GROUP BY album
	`).Scan(&result.Albums)

	db.DBInstance.Instance.Raw(`
	SELECT COUNT(DISTINCT artist) AS artists,COUNT(DISTINCT album) AS albums FROM music_files m
	LEFT JOIN music_meta_data mm ON m.meta_data_id = mm.id
	`).Scan(&result.Counts)

	// fmt.Println("this is it buddy", result[0].Path)

	// for idx, item := range result.Albums {
	// 	img, err := fetchImage(item.Path)
	// 	if err != nil {
	// 		fmt.Println("error fetching image", err)
	// 		result.Albums[idx].Image = fmt.Sprintf("%s/%s", item.Path, "cover.jpg")
	// 		continue
	// 	}
	// 	result.Albums[idx].Image = img
	// }

	// url := "/home/yuri/Data/projects/music-player-go/test-files/tst.m4a"
	// metaData, _ := ffmpeg.FFmpegInstance.GetMetadataFFProbe("/home/yuri/Data/projects/music-player-go/test-files/tst.m4a")
	// fmt.Println("this is the metadata", metaData)
	//

	// fmt.Println("i am returning the image bro", res)
	return &ReturnType{
		Data: struct {
			Albums []Album `json:"albums"`
			Counts counts  `json:"counts"`
		}{Albums: result.Albums, Counts: result.Counts},
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
