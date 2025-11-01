import { create } from "zustand";

type Playlist = {
  id: string;
  name: string;
};

type PlaylistStore = {
  playlists: Playlist[];
  setPlaylists: (playlists: Playlist[]) => void;
};

export const usePlaylistStore = create<PlaylistStore>((set) => ({
  playlists: [],
  setPlaylists: (playlists: Playlist[]) => set({ playlists }),
}));
