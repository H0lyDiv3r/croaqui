import {
  useDataStore,
  usePlayerStore,
  useQueryStore,
  useQueueStore,
} from "@/store";
import { GetQueue } from "../../../wailsjs/go/queue/Queue";

type QueueInfo = {
  type: "dir" | "album" | "playlist";
  args: string;
  shuffle: boolean;
};
export const getQueue = async (queueInfo: QueueInfo) => {
  const musicListPath = useDataStore.getState().musicListPath;
  const shuffle = useQueueStore.getState().shuffle;
  const currentTrack = usePlayerStore.getState().currentTrack;
  const res = await GetQueue(queueInfo);
  if (!res) {
    return;
  }
  const idx = res.data.queue.findIndex(
    (track: any) => track.path === currentTrack.path,
  );

  if (currentTrack.path) {
    const newQueue = res.data.queue.filter(
      (track: any) => track.path !== currentTrack.path,
    );

    console.log("Queue retrieved successfully", res.data.queue, [
      res.data.queue[idx],
      ...newQueue,
    ]);

    return [res.data.queue[idx], ...newQueue];
  }

  return res.data.queue;
};
