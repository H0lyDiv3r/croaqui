package ffmpeg

import (
	"context"
)

type FFmpeg struct {
	ctx context.Context
}

// type metadata struct {
// 	format map[string]interface{}
// }

type Metadata struct {
	Format Format `json:"format"`
}
type Format struct {
	Filename string `json:"filename"`
	Duration string `json:"duration"`
	Tags     struct {
		Title  string `json:"title"`
		Artist string `json:"artist"`
		Album  string `json:"album"`
		Genre  string `json:"genre"`
		Date   string `json:"date"`
	} `json:"tags"`
}

var FFmpegInstance *FFmpeg

func NewFFmpeg() *FFmpeg {
	FFmpegInstance = &FFmpeg{}
	return FFmpegInstance
}

// func (f *FFmpeg) GetMetadataFFProbe(path string) (Metadata, error) {
// 	cmd := exec.Command("./ffprobe", "-v", "quiet", "-print_format", "json", "-show_format", "-show_streams", path)
// 	var out bytes.Buffer
// 	cmd.Stdout = &out

// 	err := cmd.Run()
// 	if err != nil {
// 		log.Print("failed to parse metadata", err)
// 		return Metadata{}, err
// 	}
// 	var result Metadata
// 	var res map[string]interface{}
// 	err = json.Unmarshal(out.Bytes(), &res)
// 	if err != nil {
// 		return Metadata{}, err
// 	}
// 	fmt.Println("coming from ffprobe", out.String())

// 	return result, nil
// }

func (f *FFmpeg) StartUp(ctx context.Context) {
	f.ctx = ctx
}
