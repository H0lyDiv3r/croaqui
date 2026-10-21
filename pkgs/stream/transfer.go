package stream

import (
	"fmt"
	"io"
	"net"
	"net/http"
	"os"
	"time"
)

func (s *Stream) StreamAudio(url string) {
	if !s.IsHost {
		return
	}

	file, err := os.Open("/home/yuri/Data/music/Supertramp/Brother Where You Bound/03 No Inbetween.mp3")
	if err != nil {
		return
	}
	defer file.Close()

	buf := make([]byte, 1200)
	for {
		n, err := file.Read(buf)
		if n > 0 {
			for _, peer := range s.Peers {
				if peer.Conn != nil {
					peer.Conn.Write(buf[:n])
				}
			}
			time.Sleep(5 * time.Millisecond)
		}
		if err != nil {
			return
		}
	}
}

func (s *Stream) AcceptAudio() {
	peer, err := s.getHost()
	if err != nil || peer.Conn == nil {
		return
	}

	pr, pw := io.Pipe()

	//write
	go func() {
		defer pw.Close()
		buf := make([]byte, 1200)
		for {
			n, err := peer.Conn.Read(buf)

			if err != nil {
				return
			}

			if n > 0 {
				_, err := pw.Write(buf[:n])
				if err != nil {
					fmt.Println("pw write failed")
					return
				}
			}
		}
	}()

	listener, err := net.Listen("tcp", "localhost:0")

	if err != nil {
		return
	}

	server := &http.Server{
		Handler: http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "audio/mpeg")
			w.Header().Set("Transfer-Encoding", "chunked")
			io.Copy(w, pr)
		}),
	}

	go server.Serve(listener)

	defer server.Close()

	streamURL := fmt.Sprintf("http://%s", listener.Addr().String())

	if s.Player != nil {
		s.Player.LoadMusic(streamURL, false)
	}

	// listener, err := net.Listen("tcp", "127.0.0.1:0")
	//
	//	if err != nil {
	//		return
	//	}
	//
	// defer listener.Close()
	//
	// var once sync.Once
	// done := make(chan struct{})
	//
	// mux := http.NewServeMux()
	//
	//	mux.HandleFunc("/stream", func(w http.ResponseWriter, r *http.Request) {
	//		w.Header().Set("Content-Type", "audio/mpeg")
	//		w.Header().Set("Transfer-Encoding", "chunked")
	//		io.Copy(w, pr)
	//		once.Do(func() {
	//			close(done)
	//		})
	//	})
	//
	// server := &http.Server{Handler: mux}
	// go server.Serve(listener)
	// defer server.Close()
	//
	// streamURL := fmt.Sprintf("http://%s/stream", listener.Addr().String())
	//
	//	if s.Player != nil {
	//		s.Player.LoadMusic(streamURL, false)
	//	}
	//
	// buf := make([]byte, 1200)
	// firstPacket := true
	//
	//	for {
	//		if !firstPacket {
	//			peer.Conn.SetReadDeadline(time.Now().Add(3 * time.Second))
	//		}
	//
	//		n, err := peer.Conn.Read(buf)
	//		if err != nil {
	//			break
	//		}
	//		firstPacket = false
	//
	//		if n > 0 {
	//			_, err = pw.Write(buf[:n])
	//			if err != nil {
	//				break
	//			}
	//		}
	//	}
	//
	// pw.Close()
	// select {
	// case <-done:
	// case <-time.After(1 * time.Second):
	// }
}

func (s *Stream) getHost() (*Peer, error) {
	var peer *Peer

	if len(s.Peers) <= 0 {
		return nil, fmt.Errorf("no connections found")
	}

	for _, p := range s.Peers {
		peer = p
		break
	}
	return peer, nil
}
