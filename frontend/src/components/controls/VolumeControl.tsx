//@ts-nocheck
import { Box, Icon, Input, Text } from "@chakra-ui/react";
import React, { forwardRef, memo, useContext } from "react";
import { FaVolumeLow, FaVolumeXmark } from "react-icons/fa6";
import "./volume.css";
import { SetVolume, ToggleMute } from "../../../wailsjs/go/player/Player";
import { usePlayerStore } from "@/store";

const VolumeControl = () => {
  const setVolumeState = usePlayerStore((state) => state.setVolume);
  const toggleMute = usePlayerStore((state) => state.toggleMute);
  const muted = usePlayerStore((state) => state.muted);
  const volume = usePlayerStore((state) => state.volume);
  const { handleVolume, handleMute } = {
    handleVolume: (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log("where are we", Number(e.target.value));
      SetVolume(Number(e.target.value)).then((res) => {
        console.log("setting volume", res);
        setVolumeState(res.volume);
      });
    },
    handleMute: () => {
      ToggleMute().then((res) => {
        toggleMute(res.muted);
      });
    },
  };
  return (
    <Box display={"flex"} alignItems={"center"} color={"neutral.dark.200"}>
      <Icon
        as={muted ? FaVolumeXmark : FaVolumeLow}
        onClick={() => handleMute()}
        marginRight={"2px"}
        boxSize={4}
      />
      <Box
        className="volume"
        height={"1"}
        mx={"2px"}
        display={"flex"}
        overflow={"hidden"}
        width={"100px"}
        bg={"neutral.dark.800"}
        pos={"relative"}
        opacity={muted ? 0.3 : 1}
      >
        <Input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => handleVolume(e)}
          top={0}
        />
      </Box>
    </Box>
  );
};

export default VolumeControl;
