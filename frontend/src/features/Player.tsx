import React, { useRef, useContext, memo } from "react";
import "./player.css";
import { Box, Icon, Image, Text } from "@chakra-ui/react";

import { useEffect } from "react";
// import { motion } from "framer-motion";
import { useState } from "react";
import { TbHeart, TbHeartFilled } from "react-icons/tb";
// import { useShowToast } from "../../hooks/useShowToast";
import { useCallback } from "react";
import PlaybackRateControl from "@/components/controls/PlaybackRateControl";
import VolumeControl from "@/components/controls/VolumeControl";
import Controls from "@/components/controls/Controls";
import TimeLine from "@/components/controls/TimeLine";
import {
  GetMetadata,
  GetStatus,
  LoadMusic,
} from "../../wailsjs/go/player/Player";
import { usePlayerStore } from "@/store";
import { ChakraIcon } from "@/components/ChackraIcon";
import { useGeneralStore } from "@/store/generalStore";
import { SwitchTheme } from "@/components";
import { getNeutral } from "@/utils";

const Player: React.FC = () => {
  const [favorite, setFavorite] = useState(true);
  const setAll = usePlayerStore((state) => state.setPlayerStatus);
  const setLoaded = usePlayerStore((state) => state.setLoaded);
  const setTrack = usePlayerStore((state) => state.setCurrentTrack);
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const currentTrackImage = usePlayerStore((state) => state.currentTrack);
  const audioPath = usePlayerStore((state) => state.audioPath);

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
            minWidth={"1"}
            maxW={"16"}
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
          width={"40%"}
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
          justifyContent={"flex-end"}
          px={"6px"}
          overflow={"hidden"}
        >
          <PlaybackRateControl />
          <VolumeControl />
          <SwitchTheme />
        </Box>
      </Box>
    </Box>
  );
};

export default memo(Player);
