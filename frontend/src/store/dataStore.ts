import { create } from "zustand";
import { useQueryStore } from "./queryStore";

type dir = {
  id: string;
  name: string;
  path: string;
};

type DataStore = {
  currentPlaylist: null | number;
  currentPath: string;
  dirs: dir[];
  musicFiles: any[];
  musicListPath: string;
  setMusicFiles: (musicFiles: any[]) => void;
  setDirs: (dirs: dir[]) => void;
  setCurrentPath: (dir: string) => void;
  setCurrentPlaylist: (playlistId: number | null) => void;
  setMusicListPath: (path: string) => void;
};

export const useDataStore = create<DataStore>((set) => ({
  currentPlaylist: null,
  currentPath: "/",
  musicListPath: "/",
  dirs: [],
  musicFiles: [],
  setCurrentPlaylist: (playlistId: number | null) =>
    set({ currentPlaylist: playlistId }),
  setMusicFiles: (musicFiles: any[]) => set({ musicFiles }),
  setDirs: (dirs: dir[]) => set({ dirs }),
  setCurrentPath: (path: string) =>
    set((state) => {
      useQueryStore.setState({ path: path });
      return { ...state, currentPath: path, currentPlaylist: null };
    }),
  setMusicListPath: (path: string) =>
    set({ musicListPath: path, currentPlaylist: null }),
}));
