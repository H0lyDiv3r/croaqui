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
import { useGeneralStore, usePlayerStore, useQueueStore } from "@/store";
import { ChakraIcon } from "../ChackraIcon";
import { getNeutral } from "@/utils";
import { EventsOn } from "../../../wailsjs/runtime";

import { handleNext, handlePrev } from "@/utils/action";
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
  const queue = useQueueStore((state) => state.items);
  const playingIndex = useQueueStore((state) => state.playingIndex);
  const handleLoop = useQueueStore((state) => state.setLoop);
  const loop = useQueueStore((state) => state.loop);
  const miniPlayerOpen = useGeneralStore((state) => state.miniPlayerOpen);

  const shuffle = useQueueStore((state) => state.shuffle);
  const toggleShuffle = useQueueStore((state) => state.toggleShuffle);
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
        if (time.current) {
          clearInterval(time.current);
        }
        if (!res.data.paused) {
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
    }
    return () => {
      if (time.current) clearInterval(time.current);
    };
  }, [playbackRate, paused, loaded]);

  const loopVals = [TbRepeatOff, TbRepeat, TbRepeatOnce];

  useEffect(() => {
    EventsOn("MPV:END", (msg) => {
      if (time.current) {
        clearInterval(time.current);
        usePlayerStore.setState((state) => {
          return { ...state, paused: true };
        });
      }
      console.log("ended bro ended", msg);

      if (msg.reason === "eof") {
        handleNext();
      }
    });
  }, []);
  return (
    <Box
      width={"100%"}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      color={getNeutral("light", 400)}
      _dark={{ color: getNeutral("dark", 400) }}
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
          action={handleLoop}
          color={loop === 0 ? getNeutral("light", 300) : "brand.500"}
          _dark={{ color: loop === 0 ? getNeutral("dark", 300) : "brand.500" }}
          _hover={{ bg: "none" }}
        >
          <ChakraIcon icon={loopVals[loop]} boxSize={miniPlayerOpen ? 3 : 4} />
        </PlayerButton>
        <PlayerButton
          action={() => handlePrev()}
          // disabled={playingIndex <= 0}
          color={getNeutral("light", 300)}
          _dark={{ color: getNeutral("dark", 300) }}
          _hover={{
            bg: "none",
            color: getNeutral("light", 400),
            _dark: { color: getNeutral("dark", 400) },
          }}
        >
          <ChakraIcon
            icon={TbPlayerTrackPrevFilled}
            boxSize={miniPlayerOpen ? 3 : 4}
          />
        </PlayerButton>
        <PlayerButton
          action={() => handlePlay()}
          disabled={!loaded}
          color={getNeutral("light", 300)}
          border={`1px ${getNeutral("light", 200)} solid`}
          _dark={{
            color: getNeutral("dark", 300),
            border: `1px ${getNeutral("dark", 200)} solid`,
          }}
        >
          <ChakraIcon
            icon={paused ? TbPlayerPlayFilled : TbPlayerPauseFilled}
            boxSize={4}
          />
        </PlayerButton>

        <PlayerButton
          action={() => handleNext()}
          // disabled={playingIndex >= queue.length - 1}
          color={getNeutral("light", 300)}
          _dark={{
            color: getNeutral("dark", 300),
          }}
          _hover={{
            bg: "none",
            color: getNeutral("light", 400),
            _dark: { color: getNeutral("dark", 400) },
          }}
        >
          <ChakraIcon
            icon={TbPlayerTrackNextFilled}
            boxSize={miniPlayerOpen ? 3 : 4}
          />
        </PlayerButton>
        <PlayerButton
          action={async () => toggleShuffle()}
          _hover={{ bg: "none" }}
          color={shuffle ? "brand.500" : getNeutral("light", 300)}
          _dark={{
            color: shuffle ? "brand.500" : getNeutral("dark", 300),
          }}
        >
          <ChakraIcon
            icon={shuffle ? TbArrowsShuffle : TbArrowsRight}
            boxSize={miniPlayerOpen ? 3 : 4}
          />
        </PlayerButton>
      </Box>
    </Box>
  );
};

export default Controls;
