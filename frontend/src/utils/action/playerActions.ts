import { usePlayerStore, useQueueStore } from "@/store";
import {
  GetImage,
  GetStatus,
  LoadMusic,
} from "../../../wailsjs/go/player/Player";
import { GetQueue } from "../../../wailsjs/go/queue/Queue";
import { FetchImage } from "wailsjs/go/media/Media";

// const audioFiles = useDataStore((state) => state.musicFiles);
// const scrollRef = useRef<HTMLDivElement>(null);
// const setAll = usePlayerStore((state) => state.setPlayerStatus);
// const setLoaded = usePlayerStore((state) => state.setLoaded);
// const setTrack = usePlayerStore((state) => state.setCurrentTrack);
// const currentPath = useDataStore((state) => state.currentPath);
// const currentPlaylist = useDataStore((state) => state.currentPlaylist);
// const playlist = usePlaylistStore((state) => state.playlists);
// const setQueue = useQueueStore((state) => state.setQueue);

const setLoaded = usePlayerStore.getState().setLoaded;
const setAll = usePlayerStore.getState().setPlayerStatus;
const setTrack = usePlayerStore.getState().setCurrentTrack;
const setQueue = useQueueStore.getState().setQueue;
const setCurrentTrackImage = usePlayerStore.getState().setCurrentTrackImage;
// const setCurrentTrackImage = usePlayerStore(
//   (state) => state.setCurrentTrackImage,
// );
export const loadAudio = async (item: any) => {
  setLoaded(false);
  setTrack(item);

  const loaded = await LoadMusic(item.path);

  if (!loaded) {
    return;
  }

  setLoaded(true);
  setTrack(item);
  GetImage().then((res) => {});
  const status = await GetStatus();
  const img = await FetchImage(item.path);
  setCurrentTrackImage(img || "");

  if (!status.data) return;
  setAll({
    ...status.data,
    position: status.data.position || 0,
    duration: item.duration,
  });
  // })
  // .then((res) => {
  //   console.log("loaded");

  //   setTimeout(() => {
  //   }, 1000);
  // .catch((error) => {
  //   console.error("Error loading music:", error);
  // });
};

export const handleNext = () => {
  const currentTrack = usePlayerStore.getState().currentTrack;
  const queue = useQueueStore.getState().items;
  const currentIndex = useQueueStore.getState().playingIndex;
  const setCurrentIndex = useQueueStore.getState().setPlayingIndex;
  const loop = useQueueStore.getState().loop;

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

  const nextTrack = queue[nextIndex];
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
  const nextTrack = queue[nextIndex];
  setCurrentIndex(nextIndex);

  if (nextTrack) {
    loadAudio(nextTrack);
  }
};
