import { create } from "zustand";
import { useQueryStore } from "./queryStore";

type dir = {
  id: string;
  name: string;
  path: string;
};

type DataStore = {
  currentPath: string;
  dirs: dir[];
  musicFiles: any[];
  setMusicFiles: (musicFiles: any[]) => void;
  setDirs: (dirs: dir[]) => void;
  setCurrentPath: (dir: string) => void;
};

export const useDataStore = create<DataStore>((set) => ({
  currentPath: "/",
  dirs: [],
  musicFiles: [],
  setMusicFiles: (musicFiles: any[]) => set({ musicFiles }),
  setDirs: (dirs: dir[]) => set({ dirs }),
  setCurrentPath: (path: string) =>
    set((state) => {
      useQueryStore.setState({ path: path });
      return { ...state, currentPath: path };
    }),
}));
