import { dir } from "wailsjs/go/models";
import { create } from "zustand";

type dir = {
  id: string;
  name: string;
  path: string;
};

type NavigationStore = {
  currentPath: string;
  dirs: dir[];
  musicFiles: any[];
  setMusicFiles: (musicFiles: any[]) => void;
  setDirs: (dirs: dir[]) => void;
  setCurrentPath: (dir: string) => void;
};

export const useNavigationStore = create<NavigationStore>((set) => ({
  currentPath: "/",
  dirs: [],
  musicFiles: [],
  setMusicFiles: (musicFiles: any[]) => set({ musicFiles }),
  setDirs: (dirs: dir[]) => set({ dirs }),
  setCurrentPath: (path: string) => set({ currentPath: path }),
}));
