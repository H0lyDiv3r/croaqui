import { Box, Text } from "@chakra-ui/react";
import { MusicList } from "./MusicList";
import { getNeutral, toHMS } from "@/utils";
import { usePlaylistStore } from "@/store";

export const PlaylistDetail = () => {
  const playlistMetaData = usePlaylistStore((state) => state.playlistMetaData);
  return (
    <Box px={8}>
      <Box
        display="flex"
        flexDir="column"
        justifyContent="space-between"
        height="100%"
        textAlign="left"
        color={getNeutral("light", 200)}
        _dark={{
          color: getNeutral("dark", 200),
        }}
        py={1}
        my={6}
      >
        {/* Title */}
        <Text fontSize="3xl" fontWeight="700" lineHeight="1.2">
          {playlistMetaData.title}
        </Text>
        <Box
          color={getNeutral("light", 400)}
          _dark={{ color: getNeutral("dark", 400) }}
        >
          <Text fontSize="lg" mt={2}>
            {playlistMetaData.albums} Albums • {playlistMetaData.artists}{" "}
            Artists
          </Text>

          {/* Stats */}
          <Box mt="auto">
            <Text fontSize="sm" mt={0.5}>
              {playlistMetaData.songs} Songs •{" "}
              {toHMS(Number(playlistMetaData.duration))}
            </Text>
          </Box>
        </Box>

        {/* Meta */}
      </Box>

      <Box>
        <MusicList />
      </Box>
    </Box>
  );
};
