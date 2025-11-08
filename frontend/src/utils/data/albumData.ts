import { QueryParams, useQueryStore } from "@/store";
import { GetAlbums, GetAlbumData } from "../../../wailsjs/go/media/Media";

export const getAlbums = async (params?: Partial<QueryParams> | null) => {
  const query = {
    ...useQueryStore.getState(),
    ...params,
  };
  if (!query.hasMore) {
    return;
  }
  const albums = await GetAlbums(
    JSON.stringify({
      ...useQueryStore.getState(),
      ...params,
    }),
  );
  if (!albums) {
    return;
  }
  useQueryStore.setState((state) => ({
    ...state,
    hasMore: albums.data.hasMore,
  }));

  return albums.data;
};

export const getAlbumData = async (id: string) => {
  const album = await GetAlbumData(id);
  if (!album) {
    return;
  }

  return album.data;
};
