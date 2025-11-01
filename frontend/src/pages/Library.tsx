import { MusicList, PlaylistDetail } from "@/components/music-list";
import { DirectoryDetail } from "@/components/music-list/DirectoryDetail";
import { QueueBar } from "@/features/queue-bar/QueueBar";
import { SidebarNavigator } from "@/features/sidebar-navigator";
import { useDataStore } from "@/store";
import { getNeutral } from "@/utils";
import { Box } from "@chakra-ui/react";

export const Library = () => {
  const currentPlaylistId = useDataStore((state) => state.currentPlaylist);
  return (
    <Box display={"flex"} height={"100%"} width={"100%"}>
      <Box
        // bg={getNeutral("light", 800)}
        // _dark={{ bg: getNeutral("dark", 800) }}
        height={"100%"}
      >
        <SidebarNavigator />
      </Box>
      <Box flex={1} height={"100%"}>
        {currentPlaylistId ? <PlaylistDetail /> : <DirectoryDetail />}
      </Box>
      <Box height={"100%"}>
        <QueueBar />
      </Box>
    </Box>
  );
};
