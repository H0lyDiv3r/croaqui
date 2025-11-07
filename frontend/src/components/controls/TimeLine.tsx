import { Box, Text, Input, Slider } from "@chakra-ui/react";
import { GetPosition, SetPosition } from "../../../wailsjs/go/player/Player";
import { usePlayerStore } from "@/store";
import { getNeutral } from "@/utils";

const TimeLine: React.FC = () => {
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

  const SliderControl: any = Slider.Control;
  const SliderTrack: any = Slider.Track;
  const SliderThumb: any = Slider.Thumb;
  const SliderMarkerGroup: any = Slider.MarkerGroup;
  const SliderRange: any = Slider.Range;
  return (
    <Box
      width={"100%"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      fontSize={"sm"}
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
      <Box flex={1} mx={2}>
        <Slider.Root
          size={"sm"}
          value={[(position / length) * 100]}
          onValueChange={(e: any) => {
            handlePosition(e);
          }}
        >
          <SliderControl>
            <SliderTrack
              bg={getNeutral("dark", 700)}
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

export default TimeLine;
