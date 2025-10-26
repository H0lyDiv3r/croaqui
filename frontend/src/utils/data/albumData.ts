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
    console.log("failed to fetch albums", albums);
    return;
  }
  useQueryStore.setState((state) => ({
    ...state,
    hasMore: albums.data.hasMore,
  }));

  console.log("showing albums", albums.data);
  return albums.data;
};

export const getAlbumData = async (id: string) => {
  const album = await GetAlbumData(id);
  if (!album) {
    console.log("failed to fetch album", album);
    return;
  }
  console.log("album", album);

  return album.data;
};
