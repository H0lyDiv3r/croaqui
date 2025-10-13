//@ts-nocheck
import { colors } from "@/themes/colors";
import { create } from "zustand";

type GeneralStore = {
  theme: "DARK" | "LIGHT";
  getNeutral: (val: number) => any;
  toggleTheme: () => void;
};

export const useGeneralStore = create<GeneralStore>((set, get) => ({
  theme: "DARK",
  getNeutral: (val: number, theme: string) => {
    // const theme = get().theme.toLowerCase();
    return `neutral.${theme}.${val}`;
    // return colors.neutral[theme][val as keyof typeof colors.neutral.dark];
  },
  toggleTheme: () =>
    set((state) => {
      console.log("switching theme", state.theme);
      return { theme: state.theme === "DARK" ? "LIGHT" : "DARK" };
    }),
}));
