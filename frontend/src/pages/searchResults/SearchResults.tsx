import { Box, Text } from "@chakra-ui/react";
import { getNeutral, getQueue, toHMS } from "@/utils";
import { useDataStore, usePlaylistStore, useQueueStore } from "@/store";
import { MusicList } from "@/components/music-list";
import { useEffect } from "react";

export const SearchResults = () => {
  const playlistMetaData = usePlaylistStore((state) => state.playlistMetaData);
  const shuffle = useQueueStore((state) => state.shuffle);
  const currentPlaylist = useDataStore((state) => state.currentPlaylist);

  const handleGetQueue = async (song: any) => {
    console.log("showing from search results", song);
    return await getQueue({
      type: "playlist",
      args: String(currentPlaylist || 0),
      shuffle: shuffle,
    });
  };
  useEffect(() => {
    console.log("useEffect called in search result");
  }, []);
  return (
    <Box
      height={"100%"}
      display={"flex"}
      flexDirection={"column"}
      width={"100%"}
    >
      <Box flex={1} minH={0}>
        <MusicList handleGetQueue={handleGetQueue} />
      </Box>
    </Box>
  );
};
