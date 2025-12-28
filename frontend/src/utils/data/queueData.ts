import { usePlayerStore, useQueueStore } from "@/store";
import { GetQueue, ShuffleIndex } from "../../../wailsjs/go/queue/Queue";
import { QueueInfo } from "@/types";

export const getQueue = async (queueInfo: QueueInfo) => {
  const setShuffleIndex = useQueueStore.getState().setShuffleIndex;
  const currentTrack = usePlayerStore.getState().currentTrack;
  const shuffle = useQueueStore.getState().shuffle;

  const res = await GetQueue({ ...queueInfo, args: queueInfo.args || "" });
  if (!res) {
    return;
  }

  const idx = res.data.queue.findIndex(
    (track: any) => track.path === currentTrack.path,
  );

  if (res.data.shuffleIndex) {
    //find index of idx in shuffleIndexo
    const copy: number[] = res.data.shuffleIndex;
    const indexOfIdx = copy.indexOf(idx);
    // splice
    const removed = copy.splice(indexOfIdx, 1);
    // insert infront
    setShuffleIndex([removed[0], ...copy]);
  }
  if (currentTrack.path && !shuffle) {
    const newQueue = res.data.queue.filter(
      (track: any) => track.path !== currentTrack.path,
    );

    return idx != null ? [res.data.queue[idx], ...newQueue] : res.data.queue;
  }

  return res.data.queue;
};

export const shuffleQueue = async () => {
  const queue = useQueueStore.getState().items;
  const currentTrack = usePlayerStore.getState().currentTrack;
  const setShuffleIndex = useQueueStore.getState().setShuffleIndex;
  const shuffle = useQueueStore.getState().shuffle;
  const setCurrentIndex = useQueueStore.getState().setPlayingIndex;

  if (shuffle) {
    const res = await ShuffleIndex(queue.length);
    if (res.data.shuffleIndex) {
      //find currentTrack index in queue
      const idx = queue.findIndex((item) => item.path === currentTrack.path);
      //find index of idx in shuffleIndexo
      const copy: number[] = res.data.shuffleIndex;
      const indexOfIdx = copy.indexOf(idx);
      // splice
      const removed = copy.splice(indexOfIdx, 1);
      // insert infront
      setShuffleIndex([removed[0], ...copy]);
    }
    setCurrentIndex(0);
  } else {
    const idx = queue.findIndex((item) => item.path === currentTrack.path);
    setCurrentIndex(idx);
    useQueueStore.setState({ shuffleIndex: null });
  }
};

export const addToQueue = async (song: any) => {
  const shuffle = useQueueStore.getState().shuffle;
  const shuffleIndex = useQueueStore.getState().shuffleIndex;
  const queue = useQueueStore.getState().items;
  const setQueue = useQueueStore.getState().setQueue;
  const setShuffleIndex = useQueueStore.getState().setShuffleIndex;
  if (shuffle && shuffleIndex) {
    setQueue([...queue, song]);
    setShuffleIndex([...shuffleIndex, queue.length]);
    return;
  } else {
    setQueue([...queue, song]);
  }
};
