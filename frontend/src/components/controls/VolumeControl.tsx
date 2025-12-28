import { Box, Menu, Portal, Slider } from "@chakra-ui/react";
import { SetVolume, ToggleMute } from "../../../wailsjs/go/player/Player";
import { usePlayerStore } from "@/store";
import { ChakraIcon } from "../ChackraIcon";
import { getNeutral } from "@/utils";
import { TbVolume, TbVolumeOff } from "react-icons/tb";

const SliderControl: any = Slider.Control;
const SliderTrack: any = Slider.Track;
const SliderThumb: any = Slider.Thumb;
const SliderRange: any = Slider.Range;
const MenuTrigger: any = Menu.Trigger;
const MenuPositioner: any = Menu.Positioner;
const MenuContent: any = Menu.Content;
const VolumeControl = ({
  small = false,
  orientation = "vertical",
}: {
  small?: boolean;
  orientation?: "vertical" | "horizontal";
}) => {
  const setVolumeState = usePlayerStore((state) => state.setVolume);
  const toggleMute = usePlayerStore((state) => state.toggleMute);
  const muted = usePlayerStore((state) => state.muted);
  const volume = usePlayerStore((state) => state.volume);
  const { handleVolume, handleMute } = {
    handleVolume: (value: any) => {
      SetVolume(Math.max(Math.min(Number(value), 100), 0)).then((res) => {
        setVolumeState(res.data.volume);
      });
    },
    handleMute: () => {
      ToggleMute().then((res) => {
        toggleMute(res.data.muted);
      });
    },
  };
  const handleScroll = (e: any) => {
    const sign = e.deltaY / Math.abs(e.deltaY);
    handleVolume(volume - sign * 5);
  };

  return (
    <>
      {small ? (
        <Box onWheel={(e) => handleScroll(e)}>
          <Menu.Root
            lazyMount
            positioning={{ placement: "top", gutter: 5 }}
            _dark={{
              color: getNeutral("dark", 200),
            }}
          >
            <MenuTrigger
              border={"none"}
              bg={"none"}
              _hover={{ cursor: "pointer" }}
              textAlign={"center"}
              width="100%"
              height="100%"
              _focus={{
                outline: "none",
              }}
            >
              <ChakraIcon
                icon={TbVolume}
                boxSize={5}
                color={`hsla(${Math.min(70, 120 - volume)}, 60%, 50%, ${Math.max(0.3, volume / 100)})`}
              />
            </MenuTrigger>
            <Portal>
              <MenuPositioner>
                <MenuContent
                  minWidth={"40px"}
                  bg={getNeutral("light", 800)}
                  _dark={{
                    bg: getNeutral("dark", 800),
                    borderColor: getNeutral("dark", 600),
                  }}
                  border={"1px solid"}
                  borderColor={getNeutral("light", 600)}
                  pt={2}
                >
                  <Box
                    display="flex"
                    gap={1}
                    flexDir={"column"}
                    alignItems={"center"}
                  >
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
                    <VolumeSlider
                      volume={volume}
                      handleVolume={handleVolume}
                      orientation={orientation}
                    />
                  </Box>
                </MenuContent>
              </MenuPositioner>
            </Portal>
          </Menu.Root>
        </Box>
      ) : (
        <Box
          display={"flex"}
          alignItems={"center"}
          color={getNeutral("light", 200)}
          _dark={{ color: getNeutral("dark", 200) }}
          w={"96px"}
          gap={2}
          onWheel={(e) => handleScroll(e)}
        >
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
            <VolumeSlider volume={volume} handleVolume={handleVolume} />
          </Box>
        </Box>
      )}
    </>
  );
};

const VolumeSlider = ({
  volume,
  handleVolume,
  orientation = "horizontal",
}: {
  volume: number;
  handleVolume: (volume: number) => void;
  orientation?: "horizontal" | "vertical";
}) => {
  return (
    <Slider.Root
      min={0}
      max={100}
      value={[volume]}
      size={"sm"}
      orientation={orientation}
      height={orientation === "vertical" ? "100px" : undefined}
      width={orientation === "horizontal" ? "100px" : undefined}
      onValueChange={(e: any) => {
        handleVolume(e.value);
      }}
    >
      <SliderControl pos={"relative"}>
        <SliderTrack
          bg={getNeutral("dark", 400)}
          borderRadius={"1px"}
          width={orientation === "vertical" ? "4px" : undefined}
          height={orientation === "horizontal" ? "4px" : undefined}
        >
          <SliderRange bg={"brand.300"} />
        </SliderTrack>
        <SliderThumb
          bg={"brand.700"}
          borderColor={"brand.400"}
          _drag={{
            cursor: "pointer",
          }}
        ></SliderThumb>
      </SliderControl>
    </Slider.Root>
  );
};

export default VolumeControl;
