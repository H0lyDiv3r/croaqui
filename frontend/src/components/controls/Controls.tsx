import { Badge, Box, ChakraProvider, Icon } from "@chakra-ui/react";
import React, { forwardRef, memo, useContext, useEffect, useRef } from "react";
import {
  TbRepeat,
  TbRepeatOff,
  TbRepeatOnce,
  TbPlayerPlayFilled,
  TbPlayerPauseFilled,
  TbArrowsShuffle,
  TbPlayerTrackNextFilled,
  TbPlayerTrackPrevFilled,
  TbArrowsRight,
} from "react-icons/tb";
import { PlayerButton } from "../buttons";
import { TogglePlay } from "../../../wailsjs/go/player/Player";
import { usePlayerStore } from "@/store";
import { ChakraIcon } from "../ChackraIcon";
// import { PlayerContext } from "./PlayerContextProvider";
// import { GlobalContext } from "../../store/GlobalContextProvider";

const Controls: React.FC = () => {
  const paused = usePlayerStore((state) => state.paused);
  const togglePaused = usePlayerStore((state) => state.togglePaused);
  const loaded = usePlayerStore((state) => state.loaded);
  const incrementPosition = usePlayerStore((state) => state.incrementPosition);
  const setPosition = usePlayerStore((state) => state.setPosition);
  const position = usePlayerStore((state) => state.position);
  const playbackRate = usePlayerStore((state) => state.speed);
  const time = useRef<NodeJS.Timeout | null>(null);
  const handleTimeline = () => {
    if (time.current) {
      clearInterval(time.current);
    }
    time.current = setInterval(() => {
      incrementPosition();
    }, 1000 / playbackRate);
  };
  const { handlePlay } = {
    handlePlay: () => {
      TogglePlay().then((res) => {
        console.log("coming from play", res);
        if (time.current) {
          clearInterval(time.current);
        }
        if (!res.data.paused) {
          console.log("is paused", res.data.paused);
          handleTimeline();
        }
        togglePaused(res.data.paused);
        setPosition(res.data.position);
      });
    },
  };
  useEffect(() => {
    if (paused && time.current) {
      clearInterval(time.current);
    }
    if (!paused && loaded) {
      handleTimeline();
      console.log("i am here bro handling timelie", paused, loaded);
    }
  }, [playbackRate, paused, loaded]);
  // useEffect(() => {
  //   handleTimeline();
  // }, [loaded]);
  const { handleNextPrev, handleShuffle, shuffle, handleLoop, loop, queue } = {
    handleLoop: () => {},
    handleShuffle: () => {},
    handleNextPrev: (val: string) => {},
    shuffle: true,
    loop: 0,
    queue: { list: [] },
  };

  const loopVals = [TbRepeatOff, TbRepeat, TbRepeatOnce];
  return (
    <Box
      width={"100%"}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      color={"neutral.400"}
      my={"4px"}
    >
      {/* main */}
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        width={"50%"}
        px={"18px"}
      >
        <PlayerButton
          action={() => handleLoop()}
          color={loop === 0 ? "neutral.dark.300" : "brand.500"}
          _hover={{ bg: "none" }}
        >
          <ChakraIcon icon={loopVals[loop]} boxSize={4} />
        </PlayerButton>
        <PlayerButton
          action={() => handleNextPrev("prev")}
          disabled={queue.list.length < 1}
          color={"neutral.dark.300"}
          _hover={{ bg: "none", color: "neutral.dark.400" }}
        >
          <ChakraIcon icon={TbPlayerTrackPrevFilled} boxSize={4} />
        </PlayerButton>
        <PlayerButton
          action={() => handlePlay()}
          disabled={!loaded}
          color={"neutral.dark.300"}
          border={`1px neutral.dark.200 solid`}
          _hover={{ border: "none", bg: "white", color: "neutral.dark.900" }}
          primary
        >
          <ChakraIcon
            icon={paused ? TbPlayerPlayFilled : TbPlayerPauseFilled}
            boxSize={4}
          />
        </PlayerButton>

        <PlayerButton
          action={() => handleNextPrev("next")}
          disabled={queue.list.length < 1}
          color="neutral.dark.300"
          _hover={{ bg: "none", color: "neutral.dark.400" }}
        >
          <ChakraIcon icon={TbPlayerTrackNextFilled} boxSize={4} />
        </PlayerButton>
        <PlayerButton
          action={async () => handleShuffle()}
          _hover={{ bg: "none" }}
          color={shuffle ? "brand.500" : "neutral.dark.300"}
        >
          <ChakraIcon
            icon={shuffle ? TbArrowsShuffle : TbArrowsRight}
            boxSize={4}
          />
        </PlayerButton>
      </Box>
    </Box>
  );
};

export default Controls;
