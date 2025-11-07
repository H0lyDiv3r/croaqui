import { ChakraIcon } from "@/components/ChackraIcon";
import Controls from "@/components/controls/Controls";
import TimeLine from "@/components/controls/TimeLine";
import { useColorMode, useColorModeValue } from "@/components/ui/color-mode";
import { WindowBar } from "@/components/WindowBar";
import { usePlayerStore } from "@/store";
import { getNeutral } from "@/utils";
import {
  Box,
  Image,
  Input,
  Menu,
  Portal,
  Slider,
  Text,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { BsGripVertical } from "react-icons/bs";

import {
  GetPosition,
  SetPosition,
  SetVolume,
  ToggleMute,
} from "../../../wailsjs/go/player/Player";
import { BiVolume } from "react-icons/bi";
import { TbVolume, TbVolumeOff } from "react-icons/tb";
import { IoSpeedometer, IoSpeedometerOutline } from "react-icons/io5";

export const MiniPlayer = () => {
  const plref = useRef<HTMLElement>(null);
  const fillColor = useColorModeValue("#abc265", "#abc265");
  const currentTrack = usePlayerStore((state) => state.currentTrack);

  useEffect(() => {
    if (plref.current) {
      console.log(
        "i am here bro",
        plref.current.offsetHeight,
        plref.current.offsetWidth,
      );
    }
  }, []);
  return (
    <>
      {/*<svg
        width="446"
        height="92"
        viewBox="0 0 446 92"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <clipPath id="clip" clipPathUnits="objectBoundingBox">
          <path
            d="M0 85V6C0 6 0 3.5 2 1.5C3.5 0 6 0 6 0H440C440 0 443.223 0.561759 444.5 2C445.608 3.24769 446 6 446 6V38C446 38 445.76 42.2672 444 44C442.501 45.4754 439 46 439 46H132C132 46 126.921 46.7296 125 49C123.405 50.8855 123 55 123 55V85C123 85 122.487 88.5129 121 90C119.513 91.4871 116 92 116 92H9C9 92 3.5 92 2 90.5C0 88.5 0 85 0 85Z"
            fill="black"
          />
        </clipPath>
      </svg>*/}

      <Box display={"flex"} mx={1} height={"100%"} gap={1}>
        <Box
          bg={getNeutral("light", 800)}
          _dark={{
            bg: getNeutral("dark", 800),
            borderColor: getNeutral("dark", 600),
          }}
          borderRadius={"sm"}
          border={"1px solid"}
          borderColor={getNeutral("light", 700)}
          display={"flex"}
          alignItems={"center"}
          className="dragRegion"
          _hover={{
            cursor: "pointer",
          }}
          my={1}
        >
          <ChakraIcon icon={BsGripVertical} />
        </Box>
        <Box
          flex={1}
          display={"flex"}
          alignItems={"center"}
          pos={"relative"}
          ref={plref}
        >
          <Box>
            {/*brand: {
              900: { value: "#40421a" }, // deeper, richer olive with cooler undertones
              800: { value: "#5B622D" }, // dark olive-green with a hint of blue
              700: { value: "#76823F" }, // balanced dark olive with more saturation
              600: { value: "#90A252" }, // medium-dark olive with fresh tone
              500: { value: "#abc265" }, // warm olive-yellow green
              400: { value: "#BDD07E" }, // lighter warm green with yellow hint
              300: { value: "#CFDD96" }, // soft pastel green-yellow
              200: { value: "#E1EBAF" }, // pale warm yellow-green
              100: { value: "#f3f8c7" },
            },*/}
            <svg
              width="452"
              height="112"
              viewBox="0 0 452 112"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="brandGradient"
                  x1="0%"
                  y1="0%"
                  x2="40%"
                  y2="100%"
                >
                  <stop offset="10%" stopColor="#abc265" /> {/* brand 600 */}
                  <stop offset="30%" stopColor="#BDD07E" /> {/* brand 600 */}
                  <stop offset="60%" stopColor="#abc265" /> {/* brand 500 */}
                  <stop offset="100%" stopColor="#90a252" /> {/* brand 400 */}
                </linearGradient>
              </defs>
              <path
                d="M0 105V6C0 6 0 3.5 2 1.5C3.5 0 6 0 6 0H446C446 0 449.223 0.561759 450.5 2C451.608 3.24769 452 6 452 6V63C452 63 451.76 67.2672 450 69C448.501 70.4754 445 71 445 71H132C132 71 126.921 71.7296 125 74C123.405 75.8855 123 80 123 80V105C123 105 122.487 108.513 121 110C119.513 111.487 116 112 116 112H9C9 112 3.5 112 2 110.5C0 108.5 0 105 0 105Z"
                fill="url(#brandGradient)"
                stroke="#5B622D"
                strokeWidth={1}
              />
            </svg>
          </Box>
          <Box pos={"absolute"} width={"100%"} display={"flex"}>
            <Box width={"123px"} height={"112px"} p={2}>
              <Box
                height={"100%"}
                bg={getNeutral("light", 800)}
                borderRadius={"xl"}
                overflow={"hidden"}
                border={"1px solid"}
                borderColor={getNeutral("light", 400)}
                boxShadow={"0 0 10px black"}
                p={1}
              >
                <Image
                  borderRadius={"lg"}
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
            </Box>
            <Box
              display={"flex"}
              flexDirection={"column"}
              flex={"1"}
              width={"389"}
            >
              <Box
                height={"71px"}
                borderRightRadius={"lg"}
                display={"flex"}
                alignItems={"center"}
                p={1}
                flexDirection={"column"}
                color={getNeutral("light", 100)}
                textAlign={"left"}
                overflow={"hidden"}
              >
                <Box
                  fontSize={"sm"}
                  whiteSpace={"nowrap"}
                  width={"100%"}
                  fontWeight={500}
                >
                  {currentTrack.title || "unknown"}
                </Box>
                <MiniTimeline />
                <Box fontSize={"xs"}>{currentTrack.artist || "unknown"}</Box>
              </Box>
              <Box
                flex={1}
                gap={1}
                borderTopLeftRadius={"lg"}
                display={"flex"}
                justifyContent={"left"}
                // bg={"red"}
                p={1}
                minH={0}
              >
                <Box
                  bg={getNeutral("light", 800)}
                  _dark={{
                    bg: getNeutral("dark", 800),
                    borderColor: getNeutral("dark", 600),
                  }}
                  borderRadius={"sm"}
                  border={"1px solid"}
                  borderColor={getNeutral("light", 600)}
                >
                  <Controls />
                </Box>
                <Box
                  flex={1}
                  p={1}
                  px={2}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  bg={getNeutral("light", 800)}
                  _dark={{
                    bg: getNeutral("dark", 800),
                    borderColor: getNeutral("dark", 600),
                  }}
                  borderRadius={"sm"}
                  border={"1px solid"}
                  borderColor={getNeutral("light", 600)}
                  color={getNeutral("light", 300)}
                >
                  <VolumeMenu />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <WindowBar />
      </Box>
    </>
  );
};

const SliderControl: any = Slider.Control;
const SliderTrack: any = Slider.Track;
const SliderThumb: any = Slider.Thumb;
const SliderMarkerGroup: any = Slider.MarkerGroup;
const SliderRange: any = Slider.Range;

const MiniTimeline = () => {
  const [timeLength, setTimeLength] = useState(0);
  const length = usePlayerStore((state) => state.duration);
  const loaded = usePlayerStore((state) => state.loaded);
  const setPositionState = usePlayerStore((state) => state.setPosition);
  const position = usePlayerStore((state) => state.position);
  const { handlePosition } = {
    handlePosition: (e: any) => {
      if (e.value < 99) {
        SetPosition(Number(e.value * length) / 100).then(() => {
          GetPosition().then((res) => {
            setPositionState(Math.round(res.data.position));
          });
        });
      }
    },
  };

  const timeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (timeRef.current) {
      setTimeLength(timeRef.current.offsetWidth);
    }
  }, []);
  return (
    <Box
      width={"100%"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      fontSize={"xs"}
    >
      <Box display={"flex"} fontWeight={300}>
        {Math.floor(position) / 3600 < 10 && <Text>0</Text>}
        <Text>{Math.floor(position / 3600) ?? 0}</Text>
        <Text>:</Text>
        {(Math.floor(position) / 60) % 60 < 10 && <Text>0</Text>}
        <Text>{Math.floor((position / 60) % 60) ?? 0}</Text>
        <Text>:</Text>
        {Math.floor(position) % 60 < 10 && <Text>0</Text>}
        <Text>{Math.floor(position % 60) ?? 0}</Text>
      </Box>
      <Box flex={1} pos={"relative"} mx={3}>
        <Slider.Root
          size={"sm"}
          value={[(position / length) * 100]}
          onValueChange={(e: any) => {
            handlePosition(e);
          }}
        >
          <SliderControl pos={"relative"}>
            <SliderTrack
              bg={getNeutral("dark", 700)}
              borderRadius={"1px"}
              height={"4px"}
              border={"1px solid"}
              borderColor={"brand.700"}
            >
              <SliderRange bg={"brand.300"} />
            </SliderTrack>
            <SliderThumb
              bg={"brand.700"}
              borderColor={"brand.200"}
            ></SliderThumb>
          </SliderControl>
        </Slider.Root>
      </Box>
      <Box display={"flex"} fontWeight={300} minW={"40px"}>
        {Math.floor(length) / 3600 < 10 && <Text>0</Text>}
        <Text>{Math.floor(length / 3600)}</Text>
        <Text>:</Text>
        {(Math.floor(length) / 60) % 60 < 10 && <Text>0</Text>}
        <Text>{Math.floor((length / 60) % 60)}</Text>
        <Text>:</Text>
        {Math.floor(length % 60) < 10 && <Text>0</Text>}
        <Text>{Math.floor(length % 60)}</Text>
      </Box>
    </Box>
  );
};
const MenuTrigger: any = Menu.Trigger;
const MenuPositioner: any = Menu.Positioner;
const MenuContent: any = Menu.Content;
const MenuItem: any = Menu.Item;
const MenuTriggerItem: any = Menu.TriggerItem;
const VolumeMenu = () => {
  const setVolumeState = usePlayerStore((state) => state.setVolume);
  const toggleMute = usePlayerStore((state) => state.toggleMute);
  const muted = usePlayerStore((state) => state.muted);
  const volume = usePlayerStore((state) => state.volume);
  const { handleVolume, handleMute } = {
    handleVolume: (value: any) => {
      SetVolume(Number(value)).then((res) => {
        setVolumeState(res.data.volume);
      });
    },
    handleMute: () => {
      ToggleMute().then((res) => {
        toggleMute(res.data.muted);
      });
    },
  };
  return (
    <>
      <Menu.Root
        lazyMount
        positioning={{ placement: "top-end", gutter: 10 }}
        // onSelect={(value: any) => {
        //   console.log("adding", songId, Number(value["value"]));
        //   addToPlaylist(songId, Number(value["value"]));
        //   handleClose();
        // }}
        _dark={{
          color: getNeutral("dark", 200),
        }}
      >
        <MenuTrigger
          border={"none"}
          bg={"none"}
          _hover={{ cursor: "pointer" }}
          textAlign={"left"}
          width="100%"
          height="100%"
          _focus={{
            outline: "none",
          }}
        >
          <ChakraIcon icon={TbVolume} boxSize={5} />
        </MenuTrigger>
        <Portal>
          <MenuPositioner>
            <MenuContent
              maxW={"10px"}
              bg={getNeutral("light", 800)}
              _dark={{
                bg: getNeutral("dark", 800),
                borderColor: getNeutral("dark", 600),
              }}
              border={"1px solid"}
              borderColor={getNeutral("light", 600)}
            >
              <Box display={"flex"} gap={1} alignItems={"center"}>
                <ChakraIcon
                  icon={muted ? TbVolumeOff : TbVolume}
                  boxSize={5}
                  onClick={() => {
                    handleMute();
                  }}
                  color={getNeutral("light", 300)}
                  _dark={{
                    color: getNeutral("dark", 300),
                  }}
                />
                <Box flex={1}>
                  <Slider.Root
                    disabled={muted}
                    size={"sm"}
                    value={[volume]}
                    onValueChange={(e: any) => {
                      handleVolume(e.value);
                    }}
                  >
                    <SliderControl pos={"relative"}>
                      <SliderTrack
                        bg={getNeutral("dark", 600)}
                        borderRadius={"1px"}
                        height={"4px"}
                      >
                        <SliderRange bg={"brand.300"} />
                      </SliderTrack>
                      <SliderThumb
                        bg={"brand.700"}
                        borderColor={"brand.200"}
                      ></SliderThumb>
                    </SliderControl>
                  </Slider.Root>
                </Box>
              </Box>
            </MenuContent>
          </MenuPositioner>
        </Portal>
      </Menu.Root>
    </>
  );
};
