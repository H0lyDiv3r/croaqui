import { Box, Text } from "@chakra-ui/react";
import { getNeutral, getQueue, toHMS } from "@/utils";
import { useDataStore, usePlaylistStore, useQueueStore } from "@/store";
import { MusicList } from "@/components/music-list";

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
  return (
    <Box height={"100%"} display={"flex"} flexDirection={"column"}>
      {/*<Box
        display="flex"
        flexDir="column"
        justifyContent="space-between"
        textAlign="left"
        color={getNeutral("light", 200)}
        _dark={{
          color: getNeutral("dark", 200),
        }}
        py={1}
        my={6}
      >
        <Text fontSize="3xl" fontWeight="700" lineHeight="1.2">
          {playlistMetaData.title || "unknown"}
        </Text>
        <Box
          color={getNeutral("light", 400)}
          _dark={{ color: getNeutral("dark", 400) }}
        >
          <Text fontSize="lg" mt={2}>
            {playlistMetaData.albums} Albums • {playlistMetaData.artists}{" "}
            Artists
          </Text>
          <Box mt="auto">
            <Text fontSize="sm" mt={0.5}>
              {playlistMetaData.songs} Songs •{" "}
              {toHMS(Number(playlistMetaData.duration))}
            </Text>
          </Box>
        </Box>
      </Box>*/}

      <Box flex={1} minH={0}>
        <MusicList handleGetQueue={handleGetQueue} />
      </Box>
    </Box>
  );
};
