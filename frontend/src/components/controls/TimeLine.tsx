import { Box, Text, Input } from "@chakra-ui/react";
import { GetPosition, SetPosition } from "../../../wailsjs/go/player/Player";
import { usePlayerStore } from "@/store";
import { getNeutral } from "@/utils";

const TimeLine: React.FC = () => {
  const length = usePlayerStore((state) => state.duration);
  const loaded = usePlayerStore((state) => state.loaded);
  const setPositionState = usePlayerStore((state) => state.setPosition);
  const position = usePlayerStore((state) => state.position);
  const { handlePosition } = {
    handlePosition: (e: React.ChangeEvent<HTMLInputElement>) => {
      SetPosition(Number(e.target.value)).then(() => {
        GetPosition().then((res) => {
          setPositionState(Math.round(res.data.position));
        });
      });
    },
  };
  return (
    <Box
      width={"100%"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      color={getNeutral("light", 200)}
      _dark={{ color: getNeutral("dark", 200) }}
      my={"4px"}
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
      <Box
        className="timeline"
        bg={getNeutral("light", 800)}
        _dark={{ bg: getNeutral("dark", 800) }}
        height={"1"}
        _hover={{ height: "4px" }}
        mx={"4px"}
        display={"flex"}
        overflow={"hidden"}
        flexGrow={1}
        position={"relative"}
      >
        <Input
          type="range"
          onChange={(e) => {
            handlePosition(e);
          }}
          // value={50}
          value={position}
          // max={currentEpisode.audioLength}
          max={length}
          min={0}
          disabled={!loaded}
          position={"absolute"}
        />
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
