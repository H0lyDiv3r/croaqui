import { create } from "zustand";

type Playlist = {
  id: string;
  name: string;
};

type PlaylistMetaData = {
  title: string;
  artists: number;
  albums: number;
  songs: number;
  duration: number;
};

type PlaylistStore = {
  playlists: Playlist[];
  playlistMetaData: PlaylistMetaData;
  setPlaylists: (playlists: Playlist[]) => void;
  setPlaylistMetaData: (metaData: PlaylistMetaData) => void;
};

export const usePlaylistStore = create<PlaylistStore>((set) => ({
  playlists: [],
  playlistMetaData: { title: "", artists: 0, albums: 0, songs: 0, duration: 0 },
  setPlaylists: (playlists: Playlist[]) =>
    set((state) => {
      return { ...state, playlists: playlists || [] };
    }),

  setPlaylistMetaData: (metaData: PlaylistMetaData) =>
    set((state) => {
      return { ...state, playlistMetaData: metaData };
    }),
}));
