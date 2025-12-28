import { usePlayerStore, useQueueStore } from "@/store";
import {
  GetImage,
  LoadMusic,
  SetPlayerStats,
} from "../../../wailsjs/go/player/Player";

const setLoaded = usePlayerStore.getState().setLoaded;
const setTrack = usePlayerStore.getState().setCurrentTrack;
const setCurrentTrackImage = usePlayerStore.getState().setCurrentTrackImage;

export const loadAudio = async (item: any, paused: boolean = false) => {
  setLoaded(false);

  const loaded = await LoadMusic(item.path, paused);

  if (!loaded) {
    return;
  }

  setLoaded(true);
  setTrack(item);
  GetImage(item.path).then((res) => {
    setCurrentTrackImage(res.data.image);
  });
  usePlayerStore.setState({
    position: 0,
    duration: item.duration,
  });
};

export const handleNext = () => {
  const currentTrack = usePlayerStore.getState().currentTrack;
  const queue = useQueueStore.getState().items;
  const currentIndex = useQueueStore.getState().playingIndex;
  const setCurrentIndex = useQueueStore.getState().setPlayingIndex;
  const loop = useQueueStore.getState().loop;
  const shuffle = useQueueStore.getState().shuffle;
  const shuffleIndex = useQueueStore.getState().shuffleIndex;

  if (!currentTrack || !queue || queue.length === 0) return;

  let nextIndex = 0;
  switch (loop) {
    case 0:
      nextIndex = Math.min(queue.length - 1, currentIndex + 1);
      break;
    case 1:
      nextIndex = (currentIndex + 1) % queue.length;
      break;
    case 2:
      nextIndex = currentIndex;
      break;
  }

  const nextTrack =
    shuffle && shuffleIndex ? queue[shuffleIndex[nextIndex]] : queue[nextIndex];
  setCurrentIndex(nextIndex);

  if (nextTrack) {
    loadAudio(nextTrack);
  }
};

export const handlePrev = () => {
  const currentIndex = useQueueStore.getState().playingIndex;
  const setCurrentIndex = useQueueStore.getState().setPlayingIndex;
  const queue = useQueueStore.getState().items;
  const loop = useQueueStore.getState().loop;
  const shuffle = useQueueStore.getState().shuffle;
  const shuffleIndex = useQueueStore.getState().shuffleIndex;

  let nextIndex = 0;
  switch (loop) {
    case 0:
      nextIndex = Math.max(0, currentIndex - 1);
      break;
    case 1:
      nextIndex =
        currentIndex <= 0
          ? queue.length - 1
          : (currentIndex - 1) % queue.length;
      break;
    case 2:
      nextIndex = currentIndex;
      break;
  }
  const nextTrack =
    shuffle && shuffleIndex ? queue[shuffleIndex[nextIndex]] : queue[nextIndex];

  setCurrentIndex(nextIndex);

  if (nextTrack) {
    loadAudio(nextTrack);
  }
};

export const loadFromQueue = (index: number) => {
  const queue = useQueueStore.getState().items;
  const shuffleIndex = useQueueStore.getState().shuffleIndex;
  const shuffle = useQueueStore.getState().shuffle;
  const setCurrentIndex = useQueueStore.getState().setPlayingIndex;
  if (index >= queue.length) {
    return;
  }
  const nextTrack =
    shuffle && shuffleIndex ? queue[shuffleIndex[index]] : queue[index];

  if (nextTrack) {
    setCurrentIndex(index);
    loadAudio(nextTrack);
  }
};

export const setMpvPlayerStats = async (status: {
  muted: boolean;
  speed: number;
  volume: number;
  position: number;
  paused: boolean;
  duration: number;
}) => {
  await SetPlayerStats(status);
};
