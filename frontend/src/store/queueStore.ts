import { Song } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type QueueStore = {
  items: Song[];
  setQueue: (queue: any) => void;
  playingIndex: number;
  setPlayingIndex: (index: number) => void;
  shuffle: boolean;
  toggleShuffle: () => void;
  loop: number; //0 noloop, 1 loop, 2 repeat
  setLoop: () => void;
  shuffleIndex: number[] | null;
  setShuffleIndex: (shuffleIndex: number[]) => any;
};

export const useQueueStore = create(
  persist<QueueStore>(
    (set) => ({
      loop: 0,
      items: [],
      playingIndex: 0,
      shuffleIndex: null,
      setQueue: (queue: any) => set({ items: queue }),
      setPlayingIndex: (index: number) => set({ playingIndex: index }),
      shuffle: false,
      toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),
      setLoop: () => set((state) => ({ loop: (state.loop + 1) % 3 })),
      setShuffleIndex: (shuffleIndex: number[]) =>
        set((state) => ({
          shuffleIndex: shuffleIndex,
        })),
    }),
    {
      name: "queue-store",
    },
  ),
);
