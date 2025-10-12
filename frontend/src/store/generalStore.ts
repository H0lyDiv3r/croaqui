import { create } from "zustand";

type GeneralStore = {
  theme: "DARK" | "LIGHT";
};

export const useGeneralStore = create<GeneralStore>((set) => ({
  theme: "DARK",
  setTheme: (theme: "DARK" | "LIGHT") => set((state) => ({ ...state, theme })),
}));
