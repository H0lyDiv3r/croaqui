import {
  GetPlaylist,
  GetPlaylists,
  CreatePlaylist,
  AddToPlaylist,
  RemoveFromPlaylist,
  DeletePlaylist,
  AddToFavorites,
  RemoveFromFavorites,
} from "../../../wailsjs/go/playlist/Playlist";

export const getPlaylists = async () => {
  const playlists = await GetPlaylists();
  if (!playlists) {
    return [];
  }
  return playlists.data.playlists;
};

export const getPlaylistContent = async (id: number) => {
  const playlist = await GetPlaylist(id);
  if (!playlist) {
    return [];
  }
  return playlist.data;
};

export const createPlaylist = async (name: string) => {
  const playlist = await CreatePlaylist(name);
  if (!playlist) {
    return null;
  }
  return playlist.data.playlist;
};

export const addToPlaylist = async (songId: number, playlistId: number) => {
  const playlist = await AddToPlaylist(songId, playlistId);
  if (!playlist) {
    return null;
  }
};

export const addToFavorites = async (songId: number) => {
  const playlist = await AddToFavorites(songId);
  if (!playlist) {
    return null;
  }
};

export const removeFromFavorites = async (songId: number) => {
  const playlist = await RemoveFromFavorites(songId);
  if (!playlist) {
    return null;
  }
};

export const removeFromPlaylist = async (
  songId: number,
  playlistId: number,
  id: number,
) => {
  const playlist = await RemoveFromPlaylist(songId, playlistId, id);
  if (!playlist) {
    return null;
  }
  return playlist.data.songId;
};

export const deletePlaylist = async (id: number) => {
  const playlist = await DeletePlaylist(id);
  if (!playlist) {
    return null;
  }

  return playlist.data.playlist;
};
