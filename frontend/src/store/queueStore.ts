import { create } from "zustand";

type QueueStore = {
  items: any[];
  setQueue: (queue: any) => void;
  playingIndex: number;
  setPlayingIndex: (index: number) => void;
  shuffle: boolean;
  toggleShuffle: () => void;
  loop: number; //0 noloop, 1 loop, 2 repeat
  setLoop: () => void;
};

export const useQueueStore = create<QueueStore>((set) => ({
  loop: 0,
  items: [],
  playingIndex: 0,
  setQueue: (queue: any) => set({ items: queue }),
  setPlayingIndex: (index: number) => set({ playingIndex: index }),
  shuffle: false,
  toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),
  setLoop: () => set((state) => ({ loop: (state.loop + 1) % 3 })),
}));
