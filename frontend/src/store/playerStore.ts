import { create } from "zustand";

type currentTrack = {
  image: string | null;
  artist: string;
  comment: string;
  date: string;
  description: string;
  title: string;
  path: string;
};
interface playerStore {
  audioPath: string;
  loaded: boolean;
  paused: boolean;
  position: number;
  duration: number;
  volume: number;
  muted: boolean;
  speed: number;
  setAudioPath: (audioPath: string) => void;
  currentTrack: currentTrack;
  setCurrentTrackImage: (image: string | null) => void;
  setCurrentTrack: (trackInfo: { [key: string]: any }) => void;
  togglePaused: (paused: boolean) => void;
  toggleMute: (value: boolean) => void;
  setLoaded: (loaded: boolean) => void;
  setDuration: (duration: number) => void;
  setPosition: (position: number) => void;
  setVolume: (volume: number) => void;
  setSpeed: (speed: number) => void;
  setPlayerStatus: (vals: { [key: string]: any }) => void;
  incrementPosition: () => void;
}

export const usePlayerStore = create<playerStore>((set) => ({
  audioPath: "",
  loaded: false,
  paused: true,
  position: 0,
  duration: 0,
  volume: 50,
  muted: false,
  speed: 1,
  currentTrack: {
    image: null,
    artist: "",
    comment: "",
    date: "",
    description: "",
    title: "",
    path: "",
  },
  setAudioPath: (audioPath: string) =>
    set((state) => {
      return { ...state, audioPath };
    }),
  setCurrentTrack: (trackInfo: { [key: string]: any }) =>
    set((state) => {
      return {
        ...state,
        currentTrack: {
          ...state.currentTrack,
          artist: trackInfo.artist || "",
          comment: trackInfo.comment || "",
          date: trackInfo.date || "",
          description: trackInfo.description || "",
          title: trackInfo.title || "",
          path: trackInfo.path || "",
        },
      };
    }),
  setCurrentTrackImage: (image: string | null) =>
    set((state) => {
      return { ...state, currentTrack: { ...state.currentTrack, image } };
    }),
  togglePaused: (paused) =>
    set((state) => {
      return { ...state, paused: paused };
    }),
  toggleMute: (value: boolean) =>
    set((state) => {
      return { ...state, muted: value };
    }),
  setLoaded: (loaded) =>
    set((state) => {
      return { ...state, loaded };
    }),
  setDuration: (duration: number) =>
    set((state) => {
      return { ...state, duration };
    }),
  setPosition: (position: number) =>
    set((state) => {
      return { ...state, position };
    }),
  incrementPosition: () =>
    set((state) => {
      return { ...state, position: state.position + 1 };
    }),
  setVolume: (volume: number) =>
    set((state) => {
      return { ...state, volume };
    }),
  setSpeed: (speed: number) =>
    set((state) => {
      return { ...state, speed };
    }),
  setPlayerStatus: (vals: { [key: string]: any }) =>
    set((state) => {
      return {
        ...state,
        paused: vals.paused,
        position: vals.position,
        duration: vals.duration,
        volume: vals.volume,
        muted: vals.muted,
        speed: vals.speed,
      };
    }),
}));
