import { QueryParams, useQueryStore } from "@/store";
import { GetAudio } from "../../../wailsjs/go/media/Media";

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
      ...query,
    }),
  );

  if (!response) {
    console.error("Failed to fetch audio data");
    return [];
  }

  useQueryStore.setState((state) => ({
    ...state,
    hasMore: response.data.hasMore,
  }));
  return response.data.files;
};
