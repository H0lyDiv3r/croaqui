import { DirTree } from "@/components/dir-tree";
import { PathBar } from "@/components/path-bar";
import { getNeutral } from "@/utils";
import { Box } from "@chakra-ui/react";

export const SidebarNavigator = () => {
  return (
    <Box>
      <PathBar />
      <Box my={2} p={4}>
        <DirTree />
      </Box>
    </Box>
  );
};
