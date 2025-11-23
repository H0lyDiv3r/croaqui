import { QueryParams, useDataStore, useQueryStore } from "@/store";
import { GetAlbums, GetAudio } from "../../../wailsjs/go/media/Media";

export const getAudio = async (params?: Partial<QueryParams> | null) => {
  const query = {
    ...useQueryStore.getState(),
    ...params,
  };
  if (!query.hasMore) {
    return;
  }

  const response = await GetAudio(
    JSON.stringify({
      ...useQueryStore.getState(),
      ...params,
    }),
  );

  if (!response) {
    console.error("Failed to fetch audio data");
    return [];
  }

  console.log("why are we here", response);
  useQueryStore.setState((state) => ({
    ...state,
    hasMore: response.data.hasMore,
  }));
  return response.data.files;
};
