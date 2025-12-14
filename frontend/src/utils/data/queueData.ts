import {
  useDataStore,
  usePlayerStore,
  useQueryStore,
  useQueueStore,
} from "@/store";
import { GetQueue, ShuffleIndex } from "../../../wailsjs/go/queue/Queue";
import { QueueInfo } from "@/types";

export const getQueue = async (queueInfo: QueueInfo) => {
  const musicListPath = useDataStore.getState().musicListPath;
  const setShuffleIndex = useQueueStore.getState().setShuffleIndex;
  const currentTrack = usePlayerStore.getState().currentTrack;
  const playIndex = useQueueStore.getState().playingIndex;
  const shuffle = useQueueStore.getState().shuffle;

  const setCurrentIndex = useQueueStore.getState().setPlayingIndex;
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
    console.log(
      "i have the queue right here bitch",
      res.data,
      [removed[0], ...copy],
      playIndex,
    );
  }
  if (currentTrack.path && !shuffle) {
    const newQueue = res.data.queue.filter(
      (track: any) => track.path !== currentTrack.path,
    );

    console.log(
      "Queue retrieved successfully",
      res.data.queue,
      [res.data.queue[idx], ...newQueue],
      idx,
    );

    return idx != null ? [res.data.queue[idx], ...newQueue] : res.data.queue;
    // return [];
  }

  return res.data.queue;
  // return [];
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
      console.log("i have the queue right here bitch", res.data, [
        removed[0],
        ...copy,
      ]);
    }
    setCurrentIndex(0);
  } else {
    const idx = queue.findIndex((item) => item.path === currentTrack.path);
    setCurrentIndex(idx);
    useQueueStore.setState({ shuffleIndex: null });
  }
};
