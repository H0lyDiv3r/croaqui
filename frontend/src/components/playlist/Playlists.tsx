import { getNeutral, getPlaylistContent, getPlaylists } from "@/utils";
import { Box, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ChakraIcon } from "../ChackraIcon";
import { BsFillCassetteFill } from "react-icons/bs";
import { Empty } from "../empty";
import { useDataStore } from "@/store";

export const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const setAudioFiles = useDataStore((state) => state.setMusicFiles);
  const setCurrentPlaylist = useDataStore((state) => state.setCurrentPlaylist);

  const openPlaylist = (playlistId: number) => {
    setCurrentPlaylist(playlistId);
    getPlaylistContent(playlistId).then(setAudioFiles);
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
        {playlists.length > 0 &&
          playlists.map(
            (playlist: {
              id: string;
              name: string;
              path: string;
            }): JSX.Element => (
              <Box
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
                <Box display={"flex"} alignItems={"center"} gap={"2"} p={3}>
                  <ChakraIcon icon={BsFillCassetteFill}></ChakraIcon>
                  <Text overflow={"hidden"}>{playlist.name}</Text>
                </Box>
              </Box>
            ),
          )}
      </>
    </Box>
  );
};
