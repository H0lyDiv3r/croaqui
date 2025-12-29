import { Menu, Box, Portal, Slider } from "@chakra-ui/react";
import { SetSpeed } from "../../../wailsjs/go/player/Player";
import { usePlayerStore } from "@/store";
import { ChakraIcon } from "../ChackraIcon";
import { getNeutral } from "@/utils";
import Speedometer25, {
  Speedometer100,
  Speedometer125,
  Speedometer150,
  Speedometer175,
  Speedometer200,
  Speedometer50,
  Speedometer75,
} from "@/assets/speedometer/SpeedoMeter";

// import colors from "../../themes/colors";

const SliderControl: any = Slider.Control;
const SliderTrack: any = Slider.Track;
const SliderThumb: any = Slider.Thumb;
const SliderRange: any = Slider.Range;
const MenuTrigger: any = Menu.Trigger;
const MenuPositioner: any = Menu.Positioner;
const MenuContent: any = Menu.Content;
const PlaybackRateControl = ({ small = false }: { small?: boolean }) => {
  const setPlaybackRate = usePlayerStore((state) => state.setSpeed);
  const playbackRate = usePlayerStore((state) => state.speed);
  const icons = [
    Speedometer25,
    Speedometer50,
    Speedometer75,
    Speedometer100,
    Speedometer125,
    Speedometer150,
    Speedometer175,
    Speedometer200,
  ];
  const { handlePlaybackRate } = {
    handlePlaybackRate: (value: number) => {
      SetSpeed(Math.min(Math.max(0.25, value), 2)).then((res) => {
        setPlaybackRate(res.data.speed);
      });
      // setPlaybackRate(value);
    },
  };
  const handleScroll = (e: any) => {
    const sign = e.deltaY / Math.abs(e.deltaY);
    handlePlaybackRate((playbackRate * 100 - sign * 25) / 100);
  };
  return (
    <>
      <Box
        display={"flex"}
        flexDir={"column"}
        alignItems={"center"}
        color={getNeutral("light", 200)}
        _dark={{ color: getNeutral("dark", 200) }}
        width={small ? undefined : "40px"}
        onWheel={(e) => handleScroll(e)}
      >
        {small ? (
          <ChakraIcon
            icon={icons[playbackRate ? (playbackRate * 100) / 25 - 1 : 0]}
            boxSize={6}
          />
        ) : (
          <Menu.Root
            lazyMount
            positioning={{ placement: "top", gutter: 2 }}
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
              {/*{(playbackRate * 100) / 25 - 1}*/}
              <ChakraIcon
                icon={icons[playbackRate ? (playbackRate * 100) / 25 - 1 : 0]}
                boxSize={8}
                color={"red"}
              />
              {/*<Box fontSize={"xs"} p={1}>
              {playbackRate}
            </Box>*/}
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
                  <Slider.Root
                    min={25}
                    max={200}
                    defaultValue={[25]}
                    value={[playbackRate * 100]}
                    step={25}
                    size={"sm"}
                    orientation={"vertical"}
                    height={"100px"}
                    onValueChange={(e: any) => {
                      handlePlaybackRate(Number(e.value / 100));
                    }}
                  >
                    <SliderControl pos={"relative"}>
                      <SliderTrack
                        bg={getNeutral("dark", 400)}
                        borderRadius={"1px"}
                        width={"4px"}
                      >
                        <SliderRange bg={"brand.300"} />
                      </SliderTrack>
                      <Slider.Marks marks={[0, 50, 100, 150, 200]} />
                      <SliderThumb
                        bg={"brand.700"}
                        borderColor={"brand.400"}
                        _drag={{
                          cursor: "pointer",
                        }}
                      ></SliderThumb>
                    </SliderControl>
                  </Slider.Root>
                </MenuContent>
              </MenuPositioner>
            </Portal>
          </Menu.Root>
        )}
      </Box>
    </>
  );
};
export default PlaybackRateControl;
