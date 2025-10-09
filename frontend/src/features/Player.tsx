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

const Player: React.FC = () => {
  // const {
  //   paused,
  //   handleTimeline,
  //   handleSetPlayerValues,
  //   handlePosition,
  //   handlePause,
  //   handleLoaded,
  //   loaded,
  // } = {
  //   paused: false,
  //   handleTimeline: (val: any) => {},
  //   handleSetPlayerValues: (val: any) => {},
  //   handlePosition: (val: any) => {},
  //   handlePause: (val: any) => {},
  //   handleLoaded: (val: any) => {},
  //   loaded: false,
  // };

  const [favorite, setFavorite] = useState(true);
  const setAll = usePlayerStore((state) => state.setPlayerStatus);
  const setLoaded = usePlayerStore((state) => state.setLoaded);
  const setTrack = usePlayerStore((state) => state.setCurrentTrack);
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const currentTrackImage = usePlayerStore((state) => state.currentTrack);
  const audioPath = usePlayerStore((state) => state.audioPath);
  // const [showToast] = useShowToast();

  // const handleSetFavorite = useCallback(() => {
  //   if (favorite) {
  //     api
  //       .delete("/playlist/deleteFromPlaylist", {
  //         params: {
  //           name: "favorites",
  //           path: currentTrack.path,
  //         },
  //       })
  //       .then((res) => {
  //         showToast("success", "removed from playlist");
  //         setFavorite(false);
  //       })
  //       .catch(() => {
  //         showToast("success", "failed to remove");
  //       });
  //   } else {
  //     api
  //       .post("/playlist/addToPlaylist", {
  //         ...currentTrack,
  //         playlist: "favorites",
  //       })
  //       .then(() => {
  //         showToast("success", "added to playlist");
  //         setFavorite(true);
  //       })
  //       .catch(() => {
  //         showToast("error", "failed to add to playlist");
  //       });
  //   }
  // }, [favorite, currentTrack, showToast]);

  useEffect(() => {
    // LoadMusic(audioPath)
    //   .then((res) => {
    //     console.log("loaded loaded loaded", res);
    //     setLoaded(res.data.loaded);
    //     GetMetadata().then((res) => {
    //       setTrack(res.data);
    //       console.log("am i here bro", res);
    //     });
    //     GetStatus().then((res) => {
    //       console.log("getting status", res);
    //       setAll(res.data);
    //     });
    //     // setAll(JSON.parse(res));
    //   })
    //   .catch((error) => {
    //     console.error("Error loading music:", error);
    //   });
    // if (currentTrack) {
    //   const trackName = `${import.meta.env.VITE_BASE_URL}${currentTrack.path}`;
    //   window.jsmediatags.read(trackName, {
    //     onSuccess: (tags) => {
    //       if (tags.tags.picture) {
    //         let byteCode = tags.tags.picture.data;
    //         let base64String = btoa(String.fromCharCode(...byteCode));
    //         handleSetCurrentTrackImage(base64String);
    //       } else {
    //         handleSetCurrentTrackImage(null);
    //       }
    //     },
    //     onError: (error) => {
    //       console.log(error);
    //     },
    //   });
    // }
    // if (currentTrack) {
    //   api
    //     .get("/playlist/inFav", {
    //       params: {
    //         path: currentTrack.path,
    //       },
    //     })
    //     .then((res) => {
    //       setFavorite(res.data);
    //     });
    // }
  }, [audioPath]);

  return (
    <Box
      bgImage={"/musicLiner.svg"}
      bgSize={"cover"}
      bgPos={"left"}
      width={"100%"}
      height={"100%"}
      display={"flex"}
    >
      <Box
        bg={"rgba(0,0,0,0)"}
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
          color={"neutral.dark.100"}
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
                color={"neutral.dark.300"}
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
                color={favorite ? "secondary.500" : "neutral.dark.500"}
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
        </Box>
      </Box>
    </Box>
  );
};

export default memo(Player);
