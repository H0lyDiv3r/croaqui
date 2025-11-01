import {
  GetPlaylist,
  GetPlaylists,
  CreatePlaylist,
  AddToPlaylist,
  RemoveFromPlaylist,
  DeletePlaylist,
} from "../../../wailsjs/go/playlist/Playlist";

export const getPlaylists = async () => {
  const playlists = await GetPlaylists();
  if (!playlists) {
    return [];
  }
  console.log("playlist got", playlists);
  return playlists.data.playlists;
};

export const getPlaylistContent = async (id: number) => {
  const playlist = await GetPlaylist(id);
  if (!playlist) {
    return [];
  }
  console.log("playlist content got", playlist);
  return playlist.data;
};

export const createPlaylist = async (name: string) => {
  const playlist = await CreatePlaylist(name);
  if (!playlist) {
    return null;
  }
  console.log("playlist created", playlist);
  return playlist.data.playlist;
};

export const addToPlaylist = async (songId: number, playlistId: number) => {
  const playlist = await AddToPlaylist(songId, playlistId);
  if (!playlist) {
    console.log("playlist not found");
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
    console.log("playlist not found");
    return null;
  }
  console.log("song removed from playlist", songId, playlistId);
  return playlist.data.songId;
};

export const deletePlaylist = async (id: number) => {
  const playlist = await DeletePlaylist(id);
  if (!playlist) {
    console.log("playlist not found");
    return null;
  }

  console.log("playlist deleted", playlist);
  return playlist.data.playlist;
};
