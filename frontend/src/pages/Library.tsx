import { PlaylistDetail } from "@/components/music-list";
import { DirectoryDetail } from "@/components/music-list/DirectoryDetail";
import { useDataStore } from "@/store";
import { Box } from "@chakra-ui/react";

export const Library = () => {
  const currentPlaylist = useDataStore((state) => state.currentPlaylist);
  return (
    <Box height={"100%"}>
      {currentPlaylist ? <PlaylistDetail /> : <DirectoryDetail />}
    </Box>
  );
};
