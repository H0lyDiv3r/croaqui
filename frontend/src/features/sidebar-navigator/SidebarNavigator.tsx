import { DirTree } from "@/components/dir-tree";
import { PathBar } from "@/components/path-bar";
import { getNeutral } from "@/utils";
import { Box } from "@chakra-ui/react";

export const SidebarNavigator = () => {
  return (
    <Box px={2} h={"100%"} display={"flex"} gap={2} flexDirection={"column"}>
      <PathBar />
      <Box
        my={2}
        p={2}
        flex={1}
        borderRadius={"md"}
        bg={getNeutral("light", 800)}
        _dark={{ bg: getNeutral("dark", 800) }}
        overflowY={"auto"}
      >
        <DirTree />
      </Box>
    </Box>
  );
};
