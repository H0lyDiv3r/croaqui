# Croaqui

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Go Version](https://img.shields.io/badge/go-%3E%3D1.19-blue.svg)](https://golang.org)
[![Wails](https://img.shields.io/badge/wails-v2.0+-blue.svg)](https://wails.io)

A modern, lightweight music player for Linux, built with Go and React. Croaky provides a sleek desktop application experience with powerful audio playback capabilities, playlist management, and metadata handling.

## Features

- **Audio Playback**: High-quality audio playback using MPV
- **Playlist Management**: Create, edit, and manage multiple playlists
- **Queue System**: Flexible queue management for seamless listening
- **Metadata Support**: Full metadata reading and display using TagLib
- **Format Support**: Wide range of audio formats via FFmpeg integration
- **Modern UI**: Beautiful, responsive interface built with React and Chakra UI
- **Cross-Platform Ready**: Built with Wails for native Linux desktop experience

## Prerequisites

Before installing Croaky, ensure you have the following installed:

- **Go**: Version 1.19 or higher ([Installation Guide](https://go.dev/doc/install))
- **Node.js**: Latest LTS version with npm
- **Wails**: Desktop application framework ([Installation Guide](https://wails.io/docs/gettingstarted/installation))
- **MPV**: Audio/video player ([Ubuntu/Debian: `sudo apt install mpv`](https://mpv.io/installation/))
- **FFmpeg**: Multimedia framework (optional, for extended format support)

## Installation

### Building from Source

1. **Clone the Repository**
   ```bash
   git clone https://github.com/H0lyDiv3r/croaqui.git
   cd croaqui
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

3. **Build the Application**
   ```bash
   wails build
   ```

4. **Run the Application**
   ```bash
   ./build/croaky
   ```

The built application will be available in the `build/` directory.

## Development Setup

To set up a development environment:

1. **Install Prerequisites** (as listed above)

2. **Clone and Setup**
   ```bash
   git clone https://github.com/H0lyDiv3r/croaqui.git
   cd croaqui
   cd frontend && npm install && cd ..
   ```

3. **Set Locale for Development**
   ```bash
   export LC_NUMERIC=C
   ```

4. **Start Development Server**
   ```bash
   wails dev
   ```

The application will open in development mode with hot reloading enabled.

## Usage

1. **Launch Croaky**
   - Run the built executable or start development mode

2. **Scan for Audio**
   - Navigate to your music directory and scan for audio files
   /home/yuri/Data/projects/music-player-go/test-files/app-desc-pics/scan-for-audio.png


3. **Navigate Directory**
   - Browse your music folders to find and select songs
   /home/yuri/Data/projects/music-player-go/test-files/app-desc-pics/navigate-dir.png


4. **Navigate Albums**
   - Explore your music library organized by albums
   
/home/yuri/Data/projects/music-player-go/test-files/app-desc-pics/navigate-albums.png

5. **Inside Album**
   - View all tracks in an album and select songs to play
   /home/yuri/Data/projects/music-player-go/test-files/app-desc-pics/inside-album.png


6. **Navigate Playlists**
   - Access and manage your saved playlists
   /home/yuri/Data/projects/music-player-go/test-files/app-desc-pics/navigate-playlists.png


7. **Create Playlist**
   - Create new playlists and add your favorite songs
   /home/yuri/Data/projects/music-player-go/test-files/app-desc-pics/create-playlist.png


8. **Queue**
   - Manage your playback queue, add songs, and reorder tracks
   /home/yuri/Data/projects/music-player-go/test-files/app-desc-pics/queue.png


9. **Mini Player**
   - Use the compact mini player for playback control
   /home/yuri/Data/projects/music-player-go/test-files/app-desc-pics/mini-player.png

   
## Architecture

Croaky is built using:

- **Backend**: Go with Wails framework
- **Frontend**: React with TypeScript, Chakra UI, and Framer Motion
- **Audio Engine**: MPV for playback
- **Metadata**: TagLib for audio file metadata
- **Processing**: FFmpeg for audio format handling
- **Database**: Sqlite

## Contributing

We welcome contributions! Please feel free to:

- Report bugs and issues
- Suggest new features
- Submit pull requests

For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Wails](https://wails.io) for the desktop application framework
- [MPV](https://mpv.io) for audio playback
- [FFmpeg](https://ffmpeg.org) for multimedia processing
- [TagLib](https://taglib.org) for metadata handling
- [Chakra UI](https://chakra-ui.com) for the UI components
