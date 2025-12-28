import { Box, Menu, Portal, Text } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import { ChakraIcon } from "../ChackraIcon";
import {
  addToFavorites,
  addToPlaylist,
  getNeutral,
  getPlaylists,
} from "@/utils";
import { useEffect, useState } from "react";

const MenuTrigger: any = Menu.Trigger;
const MenuPositioner: any = Menu.Positioner;
const MenuContent: any = Menu.Content;
const MenuItem: any = Menu.Item;
const MenuTriggerItem: any = Menu.TriggerItem;

export const PlaylistsMenu = ({
  songId,
  handleClose,
}: {
  songId: number;
  handleClose: () => void;
}) => {
  const [playlists, setPlaylists] = useState([]);
  useEffect(() => {
    getPlaylists().then(setPlaylists);
  }, []);

  return (
    <>
      <Menu.Root
        lazyMount
        positioning={{ placement: "left-start", gutter: 18 }}
        onSelect={(value: any) => {
          const vals = JSON.parse(value["value"]);

          if (vals.name === "favorites") {
            // Handle creating a new playlist
            addToFavorites(songId);
          } else {
            addToPlaylist(songId, Number(vals.id));
          }
          handleClose();
        }}
      >
        <MenuTrigger
          border={"none"}
          bg={"none"}
          _hover={{ cursor: "pointer" }}
          color={getNeutral("light", 200)}
          _dark={{
            color: getNeutral("dark", 200),
          }}
          textAlign={"left"}
          width="100%"
          height="100%"
          _focus={{
            outline: "none",
          }}
        >
          Add to Playlist
        </MenuTrigger>
        <Portal>
          <MenuPositioner>
            <MenuContent
              zIndex={100000}
              bg={getNeutral("light", 800)}
              _dark={{
                bg: getNeutral("dark", 800),
                borderColor: getNeutral("dark", 700),
              }}
              border={"1px solid"}
              borderColor={getNeutral("light", 700)}
            >
              <Box>
                {playlists &&
                  playlists.length &&
                  playlists.map((playlist: { id: string; name: string }) => {
                    return (
                      <MenuItem
                        value={JSON.stringify({
                          id: playlist.id,
                          name: playlist.name,
                        })}
                        key={playlist.id}
                        fontSize={"sm"}
                        p={2}
                        color={getNeutral("light", 200)}
                        _hover={{
                          cursor: "pointer",
                          bg: getNeutral("light", 700),
                        }}
                        _dark={{
                          color: getNeutral("dark", 200),
                          _hover: {
                            bg: getNeutral("dark", 700),
                          },
                        }}
                        borderRadius={"md"}
                        textAlign={"left"}
                      >
                        {playlist.name}
                      </MenuItem>
                    );
                  })}
              </Box>
            </MenuContent>
          </MenuPositioner>
        </Portal>
      </Menu.Root>
    </>
  );
};
