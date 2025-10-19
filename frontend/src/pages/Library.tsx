import { MusicList } from "@/components/music-list";
import { SidebarNavigator } from "@/features/sidebar-navigator";
import { getNeutral } from "@/utils";
import { Box } from "@chakra-ui/react";

export const Library = () => {
  return (
    <Box display={"flex"} height={"100%"}>
      <Box
        // bg={getNeutral("light", 800)}
        // _dark={{ bg: getNeutral("dark", 800) }}
        w={"350px"}
        height={"100%"}
      >
        <SidebarNavigator />
      </Box>
      <Box flex={1} height={"100%"}>
        <MusicList />
      </Box>
      <Box minW={"350px"} height={"100%"}>
        aa
      </Box>
    </Box>
  );
};
