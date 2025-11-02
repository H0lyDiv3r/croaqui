import { create } from "zustand";

type NavigatorStore = {
  navPath: string;
  setNavPath: (path: string) => void;
  dirList: string[];
  setDirList: (list: string[]) => void;

  toBeScanned: string;
  setToBeScanned: (list: string) => void;
};

export const useNavigatorStore = create<any>((set) => ({
  navPath: "",
  dirList: [],
  toBeScanned: "",
  setToBeScanned: (list: string) => set({ toBeScanned: list }),
  setDirList: (list: string[]) => set({ dirList: list }),
  setNavPath: (path: string) => set({ navPath: path }),
}));
