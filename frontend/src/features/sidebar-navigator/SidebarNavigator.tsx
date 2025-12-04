import { ChakraIcon } from "@/components/ChackraIcon";
import { DirTree } from "@/components/dir-tree";
import { PathBar } from "@/components/path-bar";
import { useScreenSize } from "@/hooks";
import { createPlaylist, getNeutral } from "@/utils";
import { Box, Tabs, useTabs } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSidebarDisclosure } from "@/store/sidebarDisclosure";
import { SideBarActionTabs } from "@/components/controls/SideBarActionTabs";

import { RiExpandLeftFill } from "react-icons/ri";
import { RiExpandRightFill } from "react-icons/ri";
import { VscFolderLibrary } from "react-icons/vsc";
import { BiSolidPlaylist } from "react-icons/bi";
import { Playlists } from "@/components/playlist";
import { useDataStore, usePlaylistStore } from "@/store";

const TabsContent: any = Tabs.Content;

export const SidebarNavigator = () => {
  const isOpen = useSidebarDisclosure((state) => state.leftBarOpen);
  const switchSide = useSidebarDisclosure((state) => state.switch);
  const [showCreatePlaylistForm, setShowCreatePlaylistForm] = useState(false);
  const currentPath = useDataStore((state) => state.currentPath);
  const setCurrentPath = useDataStore((state) => state.setCurrentPath);
  const rightOpen = useSidebarDisclosure((state) => state.rightBarOpen);

  const { isSmall, isLarge, isMedium } = useScreenSize();
  const tabs = useTabs({
    defaultValue: "dir",
  });

  const tabList = [
    { value: "dir", label: "Dir", icon: VscFolderLibrary },
    { value: "playlist", label: "Playlist", icon: BiSolidPlaylist },
  ];

  const handleHide = (target: boolean) => {
    if ((isLarge || isMedium || isSmall) && rightOpen) {
      useSidebarDisclosure.setState((state) => ({
        ...state,
        rightBarOpen: !target,
      }));
    }

    useSidebarDisclosure.setState((state) => ({
      ...state,
      leftBarOpen: target,
    }));
  };

  const handlePlaylistFormSubmission = async (value: string) => {
    const data = await createPlaylist(value);

    usePlaylistStore.setState((state) => ({
      ...state,
      playlists: [...state.playlists, { id: data.ID, name: data.Name }],
    }));
    setShowCreatePlaylistForm(false);
  };

  // useEffect(() => {
  //   if (isSmall) {
  //     handleHide(false);
  //   }
  // }, [isSmall]);
  return (
    <Box position={"relative"} height={"100%"}>
      {isOpen ? (
        <Box
          px={2}
          h={"100%"}
          display={"flex"}
          gap={2}
          flexDirection={"column"}
          width={"350px"}
        >
          <Tabs.RootProvider
            size={"sm"}
            value={tabs}
            defaultValue="members"
            variant="plain"
            lazyMount
            unmountOnExit
            height={"100%"}
            w={"100%"}
            display={"flex"}
            flexDirection={"column"}
            gap={2}
          >
            <SideBarActionTabs
              tabs={tabs}
              tabList={tabList}
              handleHide={handleHide}
              showPlaylistForm={showCreatePlaylistForm}
              handleOpenForm={(target) => {
                setShowCreatePlaylistForm(target);
              }}
              handlePlaylistFormSubmission={handlePlaylistFormSubmission}
            />

            <PathBar
              currentPath={currentPath}
              setCurrentPath={setCurrentPath}
            />
            <Box
              mb={2}
              p={2}
              flex={1}
              minH={0}
              borderRadius={"md"}
              bg={getNeutral("light", 800)}
              _dark={{ bg: getNeutral("dark", 800) }}
            >
              <Box height={"100%"} overflowY={"auto"}>
                <TabsContent value="dir" p={0} m={0}>
                  <DirTree />
                </TabsContent>
                <TabsContent value="playlist" p={0} m={0}>
                  <Playlists />
                </TabsContent>
              </Box>
            </Box>
          </Tabs.RootProvider>
        </Box>
      ) : (
        <SidebarNavigatorMobile onExpand={() => handleHide(true)} />
      )}
    </Box>
  );
};

const SidebarNavigatorMobile = ({ onExpand }: { onExpand: () => void }) => {
  return (
    <Box
      position={"absolute"}
      top={"50%"}
      bg={"brand.400"}
      border={"1px solid"}
      color={"brand.800"}
      as={"button"}
      borderColor={getNeutral("light", 600)}
      _dark={{
        borderColor: getNeutral("dark", 600),
      }}
      p={"4"}
      borderRightRadius={"md"}
      shadow={"2xl"}
      _hover={{
        cursor: "pointer",
        bg: "brand.500",
      }}
      onClick={onExpand}
      zIndex={10}
    >
      <ChakraIcon icon={RiExpandRightFill} boxSize={5} />
    </Box>
  );
};
