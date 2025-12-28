import React, { memo, useLayoutEffect } from "react";
import "./player.css";
import { Box, Image, Text } from "@chakra-ui/react";

// import { motion } from "framer-motion";
import { useState } from "react";
import { TbHeart, TbHeartFilled } from "react-icons/tb";

import PlaybackRateControl from "@/components/controls/PlaybackRateControl";
import VolumeControl from "@/components/controls/VolumeControl";
import Controls from "@/components/controls/Controls";
import TimeLine from "@/components/controls/TimeLine";

import { usePlayerStore, useSidebarDisclosure } from "@/store";
import { ChakraIcon } from "@/components/ChackraIcon";

import { addToFavorites, getNeutral, removeFromFavorites } from "@/utils";
import { useScreenSize } from "@/hooks";
const Player: React.FC = () => {
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const [favorite, setFavorite] = useState(false);
  const { isMedium, isSmall, isLarge } = useScreenSize();
  const leftOpen = useSidebarDisclosure((state) => state.leftBarOpen);
  const handleHide = (target: boolean) => {
    if ((isLarge || isMedium || isSmall) && leftOpen) {
      useSidebarDisclosure.setState((state) => ({
        ...state,
        leftBarOpen: !target,
      }));
    }

    useSidebarDisclosure.setState((state) => ({
      ...state,
      rightBarOpen: target,
    }));
  };

  useLayoutEffect(() => {
    console.log("checking if favorite", currentTrack.favorite);
    setFavorite(currentTrack.favorite);
  }, [currentTrack]);
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
            onClick={() => {
              handleHide(true);
            }}
          >
            <Image
              src={
                currentTrack.image
                  ? `${currentTrack.image}`
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
                onClick={() => {
                  setFavorite((prev) => !prev);
                  if (currentTrack.id) {
                    if (favorite) {
                      removeFromFavorites(currentTrack.id);
                    } else {
                      addToFavorites(currentTrack.id);
                    }
                  }
                }}
                icon={favorite ? TbHeartFilled : TbHeart}
                boxSize={4}
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

        <Box
          width={"30%"}
          height={"100%"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          px={"6px"}
          overflow={"hidden"}
          gap={2}
        >
          <PlaybackRateControl small={false} />
          <VolumeControl small={isMedium || isSmall} />
        </Box>
      </Box>
    </Box>
  );
};

export default memo(Player);
