import { MusicList, PlaylistDetail } from "@/components/music-list";
import { DirectoryDetail } from "@/components/music-list/DirectoryDetail";
import { QueueBar } from "@/features/queue-bar/QueueBar";
import { SidebarNavigator } from "@/features/sidebar-navigator";
import { useDataStore, useQueueStore } from "@/store";
import { getNeutral } from "@/utils";
import { Box } from "@chakra-ui/react";

export const Library = () => {
  const currentPlaylist = useDataStore((state) => state.currentPlaylist);
  const musicListPath = useDataStore((state) => state.musicListPath);
  const shuffle = useQueueStore((state) => state.shuffle);
  return (
    <Box height={"100%"}>
      {currentPlaylist ? <PlaylistDetail /> : <DirectoryDetail />}
    </Box>
  );
};
