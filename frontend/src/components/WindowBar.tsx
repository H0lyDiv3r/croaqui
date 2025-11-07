import { Box } from "@chakra-ui/react";
import { TbArrowsMaximize } from "react-icons/tb";
import { IoCloseSharp } from "react-icons/io5";
import { getNeutral } from "@/utils";
import { ChakraIcon } from "./ChackraIcon";
import { TbWindowMinimize } from "react-icons/tb";
import { Quit } from "wailsjs/runtime/runtime";
import { useGeneralStore } from "@/store";
import {
  MaximizeApp,
  MinimizeApp,
  OpenMiniPlayer,
} from "../../wailsjs/go/app/app";
import { MdDock } from "react-icons/md";

export const WindowBar = () => {
  const toggleMiniPlayer = useGeneralStore((state) => state.openMiniPlayer);
  const miniPlayerOpen = useGeneralStore((state) => state.miniPlayerOpen);
  return (
    <>
      {miniPlayerOpen ? (
        <Box height={"100%"} display={"flex"} alignItems={"center"}>
          <Box
            display={"flex"}
            flexDir={"column"}
            gap={2}
            bg={getNeutral("light", 800)}
            _dark={{
              bg: getNeutral("dark", 800),
              borderColor: getNeutral("dark", 700),
            }}
            p={1}
            borderRadius={"md"}
            border={"1px solid"}
            borderColor={getNeutral("light", 700)}
          >
            <ChakraIcon
              _hover={{
                color: getNeutral("light", 300),
                cursor: "pointer",
              }}
              icon={MdDock}
              boxSize={4}
              onClick={() => {
                toggleMiniPlayer(true);
                OpenMiniPlayer();
              }}
            />
            <ChakraIcon
              _hover={{
                color: getNeutral("light", 300),
                cursor: "pointer",
              }}
              icon={TbWindowMinimize}
              boxSize={4}
              onClick={() => {
                // WindowMinimise();
                MinimizeApp();
                // toggleMiniPlayer(false);
                // WindowSetAlwaysOnTop(false);
              }}
            />
            <ChakraIcon
              _hover={{
                color: getNeutral("light", 300),
                cursor: "pointer",
              }}
              icon={TbArrowsMaximize}
              boxSize={4}
              onClick={() => {
                // WindowToggleMaximise();
                MaximizeApp();
                toggleMiniPlayer(false);
                // WindowSetAlwaysOnTop(false);
              }}
            />
            <ChakraIcon
              _hover={{
                color: getNeutral("light", 300),
                cursor: "pointer",
              }}
              icon={IoCloseSharp}
              boxSize={4}
              onClick={() => {
                Quit();
              }}
            />
          </Box>
        </Box>
      ) : (
        <>
          <Box display={"flex"}>
            <Box
              flex={1}
              py={1}
              className="dragRegion"
              bg={getNeutral("light", 800)}
              _dark={{
                bg: getNeutral("dark", 800),
              }}
            >
              Croaqui
            </Box>
            <Box
              display={"flex"}
              alignItems="center"
              gap={3}
              bg={getNeutral("light", 700)}
              _dark={{
                bg: getNeutral("dark", 700),
              }}
              px={4}
            >
              <ChakraIcon
                _hover={{
                  color: getNeutral("light", 300),
                  cursor: "pointer",
                }}
                icon={MdDock}
                boxSize={4}
                onClick={() => {
                  toggleMiniPlayer(true);
                  OpenMiniPlayer();
                }}
              />
              <ChakraIcon
                _hover={{
                  color: getNeutral("light", 300),
                  cursor: "pointer",
                }}
                icon={TbWindowMinimize}
                boxSize={4}
                onClick={() => {
                  // WindowMinimise();
                  MinimizeApp();
                  // toggleMiniPlayer(false);
                  // WindowSetAlwaysOnTop(false);
                }}
              />
              <ChakraIcon
                _hover={{
                  color: getNeutral("light", 300),
                  cursor: "pointer",
                }}
                icon={TbArrowsMaximize}
                boxSize={4}
                onClick={() => {
                  // WindowToggleMaximise();
                  MaximizeApp();
                  toggleMiniPlayer(false);
                  // WindowSetAlwaysOnTop(false);
                }}
              />
              <ChakraIcon
                _hover={{
                  color: getNeutral("light", 300),
                  cursor: "pointer",
                }}
                icon={IoCloseSharp}
                boxSize={4}
                onClick={() => {
                  Quit();
                }}
              />
            </Box>
          </Box>
        </>
      )}
    </>
  );
};
