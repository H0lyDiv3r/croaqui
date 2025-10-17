import { useDataStore, usePlayerStore } from "@/store";
import { Box, Grid, GridItem } from "@chakra-ui/react";
import {
  GetImage,
  GetStatus,
  LoadMusic,
} from "../../../wailsjs/go/player/Player";
import { getNeutral } from "@/utils";
import { useEffect, useRef, useState } from "react";
import { getAudio } from "@/utils/data/audioData";

export const MusicList = () => {
  const audioFiles = useDataStore((state) => state.musicFiles);
  const scrollRef = useRef<HTMLDivElement>(null);
  const setAll = usePlayerStore((state) => state.setPlayerStatus);
  const setLoaded = usePlayerStore((state) => state.setLoaded);
  const setTrack = usePlayerStore((state) => state.setCurrentTrack);
  const currentPath = useDataStore((state) => state.currentPath);

  const setCurrentTrackImage = usePlayerStore(
    (state) => state.setCurrentTrackImage,
  );

  const handleScroll = () => {
    const current = scrollRef.current;
    if (!current) return;
    if (current.scrollTop + current.clientHeight >= current.scrollHeight) {
      console.log("Fetching");
      // getAudios(currentPath);
      getAudio();
    }
  };

  const loadAudio = (item: any) => {
    LoadMusic(item.path)
      .then((res) => {
        console.log("loaded loaded loaded", res, item);
        setLoaded(res.data.loaded);
        setTrack(item);
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

  useEffect(() => {
    getAudio();
  }, [currentPath]);
  return (
    <Box height={"100%"}>
      <Box
        display={"flex"}
        flexDirection={"column"}
        textAlign={"left"}
        height={"100%"}
        color={getNeutral("light", 200)}
        _dark={{
          color: getNeutral("dark", 200),
        }}
      >
        <Grid
          templateColumns="repeat(24, 1fr)"
          fontSize={"md"}
          p={"2"}
          py={"4"}
          gap={4}
          // borderBottom={"1px white solid"}
          // borderTop={"1px white solid"}
          borderColor={getNeutral("light", 600)}
          _dark={{
            borderColor: getNeutral("dark", 600),
            bg: getNeutral("dark", 700),
          }}
          borderStyle={"solid"}
          borderWidth={"1px"}
          borderRight={"none"}
          borderLeft={"none"}
          fontWeight={500}
          bg={getNeutral("light", 700)}
        >
          <GridItem colSpan={1}>#</GridItem>
          <GridItem colSpan={8}>Title</GridItem>
          <GridItem colSpan={4}>Artist</GridItem>
          <GridItem colSpan={4}>Album</GridItem>
          <GridItem colSpan={4}>Genre</GridItem>
          <GridItem colSpan={2}>Duration</GridItem>
          <GridItem colSpan={1}></GridItem>
        </Grid>

        <Box
          flex={1}
          minH={0}
          overflow={"auto"}
          onScroll={handleScroll}
          ref={scrollRef}
        >
          {audioFiles.map((item, idx) => (
            <Grid
              templateColumns="repeat(24, 1fr)"
              fontSize={"sm"}
              whiteSpace={"nowrap"}
              gap={4}
              p={"2"}
              py={"3"}
              key={item.id}
              bg={idx % 2 === 0 ? getNeutral("light", 800) : "none"}
              _dark={{
                bg: idx % 2 === 0 ? getNeutral("dark", 800) : "none",
              }}
              _hover={{
                bg: getNeutral("light", 700),
                cursor: "pointer",
                _dark: {
                  bg: getNeutral("dark", 700),
                },
              }}
              onClick={() => {
                loadAudio(item);
              }}
            >
              <GridItem colSpan={1} overflow={"hidden"}>
                {idx + 1}
              </GridItem>
              <GridItem colSpan={8} overflow={"hidden"}>
                {item.title}
              </GridItem>
              <GridItem colSpan={4} overflow={"hidden"}>
                {item.artist}
              </GridItem>
              <GridItem colSpan={4} overflow={"hidden"}>
                {item.album}
              </GridItem>
              <GridItem colSpan={4} overflow={"hidden"}>
                {item.genre}
              </GridItem>
              <GridItem colSpan={2} overflow={"hidden"}>
                {toHMS(item.duration)}
              </GridItem>
              <GridItem colSpan={1} overflow={"hidden"}>
                ...
              </GridItem>
            </Grid>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
