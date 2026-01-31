# Croaqui

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Go Version](https://img.shields.io/badge/go-%3E%3D1.19-blue.svg)](https://golang.org)
[![Wails](https://img.shields.io/badge/wails-v2.0+-blue.svg)](https://wails.io)

Just another attempt at making a local linux music player with cool ui, playlist managemenet and more to come

<img width="1920" height="1200" alt="navigate-albums" src="https://github.com/user-attachments/assets/94f7231b-6d1f-4f0c-9f94-9eeb3917dab9" />

## Features

- **Audio Playback**: High-quality audio playback using MPV
- **Playlist Management**: Create, edit, and manage multiple playlists
- **Queue System**: Flexible queue management for seamless listening
- **Metadata Support**: Full metadata reading and display using TagLib
- **Format Support**: Wide range of audio formats via FFmpeg integration
- **Modern UI**: Beautiful, responsive interface built with React and Chakra UI

## Prerequisites

Before installing Croaky, ensure you have the following installed:

- **Go**: Version 1.19 or higher ([Installation Guide](https://go.dev/doc/install))
- **Node.js**: Latest LTS version with npm
- **Wails**: Desktop application framework ([Installation Guide](https://wails.io/docs/gettingstarted/installation))
- **MPV**: Audio/video player ([Ubuntu/Debian: `sudo apt install mpv`](https://mpv.io/installation/))
- **Taglib**: you are going to need the static build for taglib.(https://taglib.org/)
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
4. **Build static libs for taglib**
   ```bash
      clone taglib 2.1.1.
      build the static libs. we are interested in tag_c.h, libtag.a, libtag_c.a
      move tag_c.h to ./internals/include and libtag.a and libtag_c.a to ./internals/lib
   ```

6. **Run the Application**
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

3. **Build static libs for taglib**
   ```bash
      clone taglib 2.1.1.
      build the static libs. we are interested in tag_c.h, libtag.a, libtag_c.a
      move tag_c.h to ./internals/include and libtag.a and libtag_c.a to ./internals/lib
   ```

5. **Start Development Server**
   ```bash
   wails dev
   ```

The application will open in development mode with hot reloading enabled.

## Usage

1. **Launch Croaky**
   - Run the built executable or start development mode

2. **Scan for Audio**
   - Navigate to your music directory and scan for audio files
   <img width="1920" height="1200" alt="scan-for-audio" src="https://github.com/user-attachments/assets/be955ba6-5488-4709-8225-8a41bb2424ec" />


3. **Navigate Directory**
   - Browse your music folders to find and select songs
   <img width="1920" height="1200" alt="navigate-dir" src="https://github.com/user-attachments/assets/d4ad3a36-5fab-47aa-bf4c-daeec187d3f8" />


4. **Navigate Albums**
   - Explore your music library organized by albums
   <img width="1920" height="1200" alt="navigate-albums" src="https://github.com/user-attachments/assets/94f7231b-6d1f-4f0c-9f94-9eeb3917dab9" />

   
5. **Inside Album**
   - View all tracks in an album and select songs to play
   <img width="1920" height="1200" alt="inside-album" src="https://github.com/user-attachments/assets/38c2aa97-cf06-4da0-8ec6-989fcb511709" />


6. **Navigate Playlists**
   - Access and manage your saved playlists
   <img width="1920" height="1200" alt="navigate-playlists" src="https://github.com/user-attachments/assets/fb285e2f-0b3c-4113-bb34-5674e21f10b4" />


7. **Create Playlist**
   - Create new playlists and add your favorite songs
   <img width="1920" height="1200" alt="create-playlist" src="https://github.com/user-attachments/assets/28ba5f4f-a3a6-499b-863c-7fce3bcdb38e" />


8. **Queue**
   - Manage your playback queue, add songs, and reorder tracks
   <img width="1920" height="1200" alt="queue" src="https://github.com/user-attachments/assets/129fbb2a-cd46-4941-a0e0-51c180a1bd3f" />


9. **Mini Player**
   - Use the compact mini player for playback control
   <img width="1920" height="1200" alt="mini-player" src="https://github.com/user-attachments/assets/7ca662f4-8297-46ed-bbf4-42e48464145f" />

   

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
