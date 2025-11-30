import { Box, Dialog, Portal, Text, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { useState } from "react";
import { TbDots } from "react-icons/tb";
import { MdOutlineAddToQueue, MdOutlineQueue } from "react-icons/md";

import { getNeutral, getPlaylistContent, removeFromPlaylist } from "@/utils";
import { PlaylistsMenu } from "./MusicActions";
import { ChakraIcon } from "../ChackraIcon";
import { useDataStore, usePlaylistStore } from "@/store";

const DialogOverlay: any = Dialog.Backdrop;
const DialogContent: any = Dialog.Content;
const DialogPositioner: any = Dialog.Positioner;
const DialogBody: any = Dialog.Body;
const MusicDropdown = ({
  songId,
  id,
  open,
  setOpen,
  position,
  clearIndexOfDropdown,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  songId: number;
  id: number | null;
  position: { x: number; y: number };
  clearIndexOfDropdown: () => void;
}) => {
  // const { open, setOpen } = useDisclosure()
  const currentPlaylistId = useDataStore((state) => state.currentPlaylist);

  const handleRemoveFromPlaylist = async (
    songId: number,
    currentPlaylistId: number,
    id: number,
  ) => {
    const data = await removeFromPlaylist(songId, currentPlaylistId, id);
    useDataStore.setState((state) => ({
      ...state,
      musicFiles: state.musicFiles.filter((file) => file.ipl !== data) || [],
    }));
  };
  return (
    <>
      <Dialog.Root open={open}>
        <Portal>
          <DialogOverlay bg={"none"} />
          <DialogPositioner
            onClick={(e: Event) => {
              e.stopPropagation();
              setOpen(false);
              clearIndexOfDropdown();
            }}
          >
            <DialogContent
              m={0}
              pos={"absolute"}
              boxShadow={"0px 2px 6px rgba(0, 0, 0, 0.2)"}
              bg={getNeutral("light", 800)}
              color={getNeutral("light", 200)}
              _dark={{
                bg: getNeutral("dark", 800),
                color: getNeutral("dark", 200),
                borderColor: getNeutral("dark", 700),
              }}
              border={"1px solid"}
              borderColor={getNeutral("light", 700)}
              top={position.y}
              left={position.x - 200}
              width={"200px"}
              onClick={(e: Event) => {
                e.stopPropagation();
              }}
            >
              <DialogBody px={"6px"}>
                <Box mb={4}>
                  <Text fontSize={"lg"}>Music Actions</Text>
                </Box>
                <ItemsWrapper>
                  <PlaylistsMenu
                    songId={songId}
                    handleClose={() => {
                      setOpen(false);
                    }}
                  />
                </ItemsWrapper>

                {currentPlaylistId && id && (
                  <ItemsWrapper>
                    <Box
                      as={"button"}
                      onClick={() =>
                        handleRemoveFromPlaylist(songId, currentPlaylistId, id)
                      }
                    >
                      Remove from Playlist
                    </Box>
                  </ItemsWrapper>
                )}
              </DialogBody>
            </DialogContent>
          </DialogPositioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

const ItemsWrapper = ({ children }: { children: React.ReactNode }) => (
  <Box
    textAlign={"left"}
    _hover={{
      cursor: "pointer",
      bg: getNeutral("light", 700),
    }}
    _dark={{
      _hover: {
        bg: getNeutral("dark", 700),
      },
    }}
    borderRadius={"md"}
    p={2}
  >
    {children}
  </Box>
);

// const PlaylistMenu = React.memo(function PlaylistMenu({ handleAddToPlaylist }) {
//   const [playlists] = useRequest();

//   const [showToast] = useShowToast();
//   const handleCreatePlaylist = useCallback(
//     (playlistName) => {
//       api
//         .post("/playlist/createPlaylist", { name: playlistName })
//         .then(() => {
//           showToast("success", "created playlist");
//         })
//         .catch(() => {
//           showToast("error", "failed to create playlist");
//         });
//       console.log("hanele", playlistName);
//     },
//     [showToast],
//   );
//   const { onOpen } = useDisclosure();

//   const handleOpen = () => {
//     playlists.request("/playlist/getPlaylists", "GET");
//     onOpen();
//   };
//   return (
//     <>
//       <Menu placement={"auto"}>
//         <MenuButton
//           onClick={handleOpen}
//           p={"8px"}
//           height={"100%"}
//           width={"full"}
//         >
//           <Box display={"flex"}>
//             <Icon as={TbPlaylistAdd} boxSize={5} mr={"6px"} />
//             <Text>Add to Playlist</Text>
//           </Box>
//         </MenuButton>
//         <MenuList bg={"neutral.dark.800"} border={"none"} p={"6px"}>
//           <CreatePlaylist action={handleCreatePlaylist} />
//           <Box mt={"8px"}>
//             {playlists.response &&
//               playlists.response.map((item) => (
//                 <MenuItem
//                   px={"8px"}
//                   borderRadius={"6px"}
//                   key={item}
//                   onClick={() => handleAddToPlaylist(item)}
//                   bg={"none"}
//                   _hover={{ bg: "neutral.dark.700" }}
//                 >
//                   {item}
//                 </MenuItem>
//               ))}
//           </Box>
//         </MenuList>
//       </Menu>
//     </>
//   );
// });

export default MusicDropdown;
