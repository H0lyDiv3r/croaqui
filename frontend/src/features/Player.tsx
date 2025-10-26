//@ts-nocheck
import React, { useRef, useContext, memo } from "react";
import "./player.css";
import { Box, Icon, Image, Menu, Portal, Text } from "@chakra-ui/react";

import { useEffect } from "react";
// import { motion } from "framer-motion";
import { useState } from "react";
import { TbHeart, TbHeartFilled } from "react-icons/tb";

import PlaybackRateControl from "@/components/controls/PlaybackRateControl";
import VolumeControl from "@/components/controls/VolumeControl";
import Controls from "@/components/controls/Controls";
import TimeLine from "@/components/controls/TimeLine";

import { usePlayerStore } from "@/store";
import { ChakraIcon } from "@/components/ChackraIcon";

import { getNeutral } from "@/utils";
import { useScreenSize } from "@/hooks";
import { FaGear } from "react-icons/fa6";
const Player: React.FC = () => {
  const [favorite, setFavorite] = useState(true);
  const { isMedium, isSmall } = useScreenSize();
  const currentTrack = usePlayerStore((state) => state.currentTrack);

  return (
    <Box
      bgImage={"./musicLiner.svg"}
      bgSize={"cover"}
      bgPos={"left"}
      width={"100%"}
      display={"flex"}
      height={"6rem"}
      boxShadow={"0px 0px 12px rgba(0, 0, 0, 0.2)"}
      borderTop={"2px solid"}
      borderColor={getNeutral("light", 700)}
      borderX={"none"}
      _dark={{
        borderColor: getNeutral("dark", 700),
      }}
    >
      <Box
        backdropFilter={"auto"}
        backdropBlur={"1px"}
        width={"100%"}
        height={"100%"}
        display={"flex"}
        alignItems={"center"}
      >
        {/* Left */}
        <Box
          maxWidth={"30%"}
          minW={"30%"}
          height={"100%"}
          minH={"full"}
          display={"flex"}
          alignItems={"center"}
          color={getNeutral("light", 100)}
          _dark={{
            color: getNeutral("dark", 100),
          }}
        >
          <Box
            width={"16"}
            minW={"16"}
            height={"16"}
            mx={"6px"}
            borderRadius={"4px"}
            overflow={"hidden"}
          >
            <Image
              src={
                currentTrack.image
                  ? `data:image/jpeg;base64,${currentTrack.image}`
                  : "./trackImage.svg"
              }
              width={"100%"}
              height={"100%"}
              fit={"cover"}
            />
          </Box>
          <Box
            display={"flex"}
            flexDir={"column"}
            justifyContent={"space-between"}
            overflow={"hidden"}
            mr={"6px"}
          >
            <Box textAlign={"left"}>
              <Text fontSize={"md"} whiteSpace={"nowrap"}>
                {currentTrack ? currentTrack.title || "unknown" : "unknown"}
              </Text>
              <Text
                fontSize={"sm"}
                color={getNeutral("light", 300)}
                _dark={{
                  color: getNeutral("dark", 300),
                }}
                whiteSpace={"nowrap"}
              >
                {currentTrack ? currentTrack.artist || "unknown" : "unknown"}
              </Text>
            </Box>
            <Box display={"flex"}>
              <ChakraIcon
                // onClick={handleSetFavorite}
                icon={favorite ? TbHeartFilled : TbHeart}
                boxSize={4}
                color={favorite ? "secondary.500" : getNeutral("light", 500)}
                _dark={{
                  color: favorite ? "secondary.500" : getNeutral("dark", 500),
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* center   */}
        <Box
          width={isMedium || isSmall ? "60%" : "40%"}
          display={"flex"}
          flexDir={"column"}
          justifyContent={"center"}
        >
          <Controls />
          <TimeLine />
        </Box>

        {/* right */}
        {isMedium || isSmall ? (
          <PlayerSettings />
        ) : (
          <Box
            width={"30%"}
            height={"100%"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"flex-end"}
            px={"6px"}
            overflow={"hidden"}
          >
            <PlaybackRateControl />
            <VolumeControl />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default memo(Player);
const PlayerSettings = () => {
  return (
    <Menu.Root>
      <Menu.Trigger
        width={"10%"}
        height={"100%"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        px={"6px"}
        overflow={"hidden"}
        _hover={{ cursor: "pointer" }}
      >
        <ChakraIcon icon={FaGear} boxSize={5} />
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            bg={getNeutral("light", 800)}
            _dark={{
              bg: getNeutral("dark", 800),
              borderColor: getNeutral("dark", 700),
              color: getNeutral("dark", 300),
            }}
            border="1px solid"
            borderColor={getNeutral("light", 700)}
            color={getNeutral("light", 300)}
            gap={6}
          >
            <Box>
              <PlaybackRateControl />
            </Box>
            <Box>
              <VolumeControl />
            </Box>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};
