import {
  deletePlaylist,
  getNeutral,
  getPlaylistContent,
  getPlaylists,
} from "@/utils";
import { Box, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { ChakraIcon } from "../ChackraIcon";
import { BsFillCassetteFill, BsFillTrashFill } from "react-icons/bs";
import { useDataStore, usePlaylistStore } from "@/store";

export const Playlists = () => {
  const playlists = usePlaylistStore((state) => state.playlists);
  const setPlaylists = usePlaylistStore((state) => state.setPlaylists);
  const setAudioFiles = useDataStore((state) => state.setMusicFiles);
  const setCurrentPlaylist = useDataStore((state) => state.setCurrentPlaylist);
  const setPlaylistMetaData = usePlaylistStore(
    (state) => state.setPlaylistMetaData,
  );

  const openPlaylist = async (playlistId: number) => {
    setAudioFiles([]);
    setCurrentPlaylist(playlistId);
    const data = await getPlaylistContent(playlistId);
    if (!data) return;
    setAudioFiles(data.playlist.songs);
    setPlaylistMetaData({ ...data.playlist.counts });
  };

  const handleDeletePlaylist = async (playlistId: number) => {
    const data = await deletePlaylist(playlistId);

    if (!data) return;
    setPlaylists(
      playlists.filter((playlist) => Number(playlist.id) !== playlistId),
    );
  };

  useEffect(() => {
    getPlaylists().then(setPlaylists);
  }, []);

  return (
    <Box
      textAlign={"left"}
      textWrap={"nowrap"}
      whiteSpace={"nowrap"}
      color={getNeutral("light", 200)}
      _dark={{ color: getNeutral("dark", 200) }}
    >
      <>
        {playlists &&
          playlists.length > 0 &&
          playlists.map(
            (playlist: { id: string; name: string }): JSX.Element => (
              <Box
                p={2}
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
                borderRadius={"sm"}
                overflow={"hidden"}
                _hover={{
                  bg: getNeutral("light", 700),
                  cursor: "pointer",
                  _dark: {
                    bg: getNeutral("dark", 700),
                  },
                }}
                key={playlist.id}
                onClick={() => {
                  openPlaylist(Number(playlist.id));
                }}
              >
                <Box display={"flex"} alignItems={"center"} gap={"2"}>
                  <ChakraIcon icon={BsFillCassetteFill}></ChakraIcon>
                  <Text overflow={"hidden"}>{playlist.name}</Text>
                </Box>
                {playlist.name != "favorites" ? (
                  <Box
                    as="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePlaylist(Number(playlist.id));
                    }}
                    _hover={{
                      cursor: "pointer",
                    }}
                    borderRadius={"sm"}
                  >
                    <ChakraIcon icon={BsFillTrashFill} />
                  </Box>
                ) : null}
              </Box>
            ),
          )}
      </>
    </Box>
  );
};
