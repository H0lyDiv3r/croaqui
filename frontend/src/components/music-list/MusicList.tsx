import { useNavigationStore, usePlayerStore } from "@/store";
import {
  Box,
  For,
  Grid,
  GridItem,
  Table,
  TableScrollArea,
  Text,
} from "@chakra-ui/react";
import {
  GetImage,
  GetMetadata,
  GetStatus,
  LoadMusic,
} from "../../../wailsjs/go/player/Player";

export const MusicList = () => {
  const audioFiles = useNavigationStore((state) => state.musicFiles);
  const setAll = usePlayerStore((state) => state.setPlayerStatus);
  const setLoaded = usePlayerStore((state) => state.setLoaded);
  const setTrack = usePlayerStore((state) => state.setCurrentTrack);
  const setCurrentTrackImage = usePlayerStore(
    (state) => state.setCurrentTrackImage,
  );
  const loadAudio = (audioPath: string) => {
    LoadMusic(audioPath)
      .then((res) => {
        console.log("loaded loaded loaded", res);
        setLoaded(res.data.loaded);
        GetMetadata().then((res) => {
          setTrack(res.data.metadata);
          console.log("am i here bro showing metadata", res);
        });
        GetImage().then((res) => {
          console.log("image", res);
          setCurrentTrackImage(res.data.image);
        });
        GetStatus().then((res) => {
          console.log("getting status", res);
          setAll(res.data);
        });
        // setAll(JSON.parse(res));
      })
      .catch((error) => {
        console.error("Error loading music:", error);
      });
  };
  function toHMS(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    return [hours, minutes, seconds]
      .map((v) => String(v).padStart(2, "0"))
      .join(":");
  }

  return (
    <Box height={"100%"}>
      <Box
        display={"flex"}
        flexDirection={"column"}
        textAlign={"left"}
        height={"100%"}
        color={"neutral.dark.200"}
      >
        <Grid
          templateColumns="repeat(12, 1fr)"
          fontSize={"sm"}
          p={"2"}
          py={"4"}
          gap={4}
          // borderBottom={"1px white solid"}
          // borderTop={"1px white solid"}
          borderColor={"neutral.dark.600"}
          borderStyle={"solid"}
          borderWidth={"1px"}
          borderRight={"none"}
          borderLeft={"none"}
        >
          <GridItem colSpan={4}>Title</GridItem>
          <GridItem colSpan={2}>Artist</GridItem>
          <GridItem colSpan={2}>Album</GridItem>
          <GridItem colSpan={2}>Genre</GridItem>
          <GridItem colSpan={1}>Duration</GridItem>
          <GridItem colSpan={1}></GridItem>
        </Grid>

        <Box flex={1} minH={0} overflow={"auto"}>
          {audioFiles.map((item, idx) => (
            <Grid
              templateColumns="repeat(12, 1fr)"
              fontSize={"sm"}
              whiteSpace={"nowrap"}
              gap={4}
              p={"2"}
              py={"3"}
              key={item.id}
              bg={idx % 2 === 0 ? "neutral.dark.800" : "none"}
              _hover={{ bg: "neutral.dark.700", cursor: "pointer" }}
              onClick={() => {
                loadAudio(item.path);
              }}
            >
              <GridItem colSpan={4} overflow={"hidden"}>
                {item.title}
              </GridItem>
              <GridItem colSpan={2} overflow={"hidden"}>
                {item.artist}
              </GridItem>
              <GridItem colSpan={2} overflow={"hidden"}>
                {item.album}
              </GridItem>
              <GridItem colSpan={2} overflow={"hidden"}>
                {item.genre}
              </GridItem>
              <GridItem colSpan={1} overflow={"hidden"}>
                {toHMS(item.duration)}
              </GridItem>
              <GridItem colSpan={1} overflow={"hidden"}>
                ...
              </GridItem>
            </Grid>
          ))}
        </Box>
      </Box>
      {/*<Table.Root size="sm" stickyHeader interactive variant={"outline"}>
        <Table.Header bg={"neutral.dark.700"} borderColor={"red"}>
          <Table.Row>
            <Table.ColumnHeader color={"neutral.dark.200"}>
              Title
            </Table.ColumnHeader>
            <Table.ColumnHeader color={"neutral.dark.200"}>
              Artist
            </Table.ColumnHeader>
            <Table.ColumnHeader color={"neutral.dark.200"}>
              Genre
            </Table.ColumnHeader>
            <Table.ColumnHeader color={"neutral.dark.200"}>
              Duration
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body height={"100px"} overflow={"auto"}>
          {audioFiles.map((item) => (
            <Table.Row
              key={item.id}
              bg={"rgba(0,0,0,0)"}
              border={"none"}
              onClick={() => {
              }}
              _hover={{ bg: "neutral.dark.700", cursor: "pointer" }}
            >
              <Table.Cell>{item.title}</Table.Cell>
              <Table.Cell>{item.artist}</Table.Cell>
              <Table.Cell>{item.genre}</Table.Cell>
              <Table.Cell>{item.duration}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>*/}

      {/*<For each={audioFiles}>
        {(item, idx) => (
          <Box key={idx} my={"24px"} onClick={() => loadAudio(item.path)}>
            <Text>{item.title}</Text>
          </Box>
        )}
      </For>*/}
    </Box>
  );
};
