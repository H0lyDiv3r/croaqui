import { create } from "zustand";

export type ToastStatus = "success" | "error" | "warning" | "info";
type Toast = {
  status: ToastStatus;
  message: string;
  delay: number;
};
type GeneralStore = {
  toasts: Toast[];
  addToast: (toast: Toast) => void;
  clearToasts: () => void;
};

export const useGeneralStore = create<GeneralStore>((set, get) => ({
  toasts: [],
  addToast: (toast: Toast) => {
    set((state) => ({
      toasts: [...state.toasts, toast],
    }));
  },
  clearToasts: () => {
    set((state) => ({
      toasts: [],
    }));
  },
}));
