import { Box, Text } from "@chakra-ui/react";
import { getNeutral, getQueue, toHMS } from "@/utils";
import {
  useDataStore,
  usePlaylistStore,
  useQueryStore,
  useQueueStore,
} from "@/store";
import { MusicList } from "@/components/music-list";
import { useEffect } from "react";

export const SearchResults = () => {
  const playlistMetaData = usePlaylistStore((state) => state.playlistMetaData);
  const shuffle = useQueueStore((state) => state.shuffle);
  const currentPlaylist = useDataStore((state) => state.currentPlaylist);
  const search = useQueryStore((state) => state.search);

  const handleGetQueue = async (song: any) => {
    return await getQueue({
      type: "playlist",
      args: String(currentPlaylist || 0),
      shuffle: shuffle,
    });
  };

  return (
    <Box
      height={"100%"}
      display={"flex"}
      flexDirection={"column"}
      width={"100%"}
      gap={8}
    >
      <Box width={"100%"} textAlign="left" px={6} mt={6}>
        <Text fontSize={"xl"} fontWeight={"bold"} fontFamily={"rubik"}>
          Results for {search}
        </Text>
      </Box>
      <Box flex={1} minH={0}>
        <MusicList handleGetQueue={handleGetQueue} />
      </Box>
    </Box>
  );
};
