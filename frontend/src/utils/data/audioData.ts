import { useDataStore, useQueryStore } from "@/store";
import { GetAudio } from "../../../wailsjs/go/dir/Directory";

export const getAudio = async () => {
  if (!useQueryStore.getState().hasMore) {
    return;
  }
  console.log("about to make a request", useQueryStore.getState());
  const response = await GetAudio(
    JSON.stringify({
      ...useQueryStore.getState(),
    }),
  );
  if (!response) {
    console.error("Failed to fetch audio data");
    return [];
  }
  useDataStore.setState((state) => ({
    ...state,
    musicFiles: [...state.musicFiles, ...response.data.files],
  }));
  useQueryStore.setState((state) => ({
    ...state,
    hasMore: response.data.hasMore,
    page: state.page + 1,
  }));
  console.log("Coming from sparate deata", response);
};
