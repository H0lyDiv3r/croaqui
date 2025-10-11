//@ts-nocheck
import React, { forwardRef, memo, useContext, useState } from "react";
import { Menu, MenuItem, Box, Icon, Button, Portal } from "@chakra-ui/react";
// import { PlayerContext } from "./PlayerContextProvider";
import { IoSpeedometer } from "react-icons/io5";
import { SetSpeed } from "../../../wailsjs/go/player/Player";
import { usePlayerStore } from "@/store";
import { ChakraIcon } from "../ChackraIcon";
// import colors from "../../themes/colors";
const speed = [
  {
    id: 0,
    name: "slow",
    value: 0.5,
  },
  {
    id: 1,
    name: "normal",
    value: 1,
  },
  {
    id: 3,
    name: "fast",
    value: 1.5,
  },
  {
    id: 4,
    name: "faster",
    value: 2,
  },
];

const PlaybackRateControl: React.FC = () => {
  const setPlaybackRate = usePlayerStore((state) => state.setSpeed);
  const playbackRate = usePlayerStore((state) => state.speed);
  const { handlePlaybackRate } = {
    handlePlaybackRate: (value: any) => {
      SetSpeed(value).then((res) => {
        console.log(res);
        setPlaybackRate(res.data.speed);
      });
    },
  };
  return (
    <>
      <Box
        display={"flex"}
        flexDir={"column"}
        alignItems={"center"}
        mx={"12px"}
        color={"neutral.dark.200"}
      >
        <Menu.Root placement="left-start">
          <Menu.Trigger>
            {speed.map((val) => {
              return (
                playbackRate == val.value && (
                  <Box
                    key={val.value}
                    // bg={"neutral.dark.800"}
                    borderStyle={"solid"}
                    borderWidth={"1px"}
                    borderColor={"neutral.dark.700"}
                    borderRadius={"md"}
                    width={"8rem"}
                    py={"1.5"}
                    px={"2.5"}
                    display={"flex"}
                    justifyContent={"center"}
                    gap={2}
                    alignItems={"center"}
                  >
                    <ChakraIcon icon={IoSpeedometer} boxSize={4} />

                    {val.name}
                  </Box>
                )
              );
            })}
          </Menu.Trigger>

          <Portal>
            <Menu.Positioner>
              <Menu.Content
                bg={"neutral.dark.800"}
                borderStyle={"solid"}
                borderWidth={"1px"}
                borderColor={"neutral.dark.700"}
                mt={"2"}
              >
                {speed.map((val) => (
                  <Menu.Item
                    key={val.id}
                    id={val.id}
                    onClick={() => handlePlaybackRate(val.value)}
                    bg={val.value == playbackRate && "brand.500"}
                    color={
                      val.value == playbackRate
                        ? "neutral.dark.800"
                        : "neutral.dark.200"
                    }
                    borderRadius={"8px"}
                    display={"flex"}
                    justifyContent={"center"}
                  >
                    {val.name}
                  </Menu.Item>
                ))}
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </Box>
    </>
  );
};
export default PlaybackRateControl;
