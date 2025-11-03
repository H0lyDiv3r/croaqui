import {
  useDataStore,
  usePlayerStore,
  usePlaylistStore,
  useQueryStore,
} from "@/store";
import { Box, Grid, GridItem, Text } from "@chakra-ui/react";
import {
  GetImage,
  GetStatus,
  LoadMusic,
} from "../../../wailsjs/go/player/Player";
import { getNeutral, removeFromPlaylist, toHMS } from "@/utils";
import { useEffect, useRef, useState } from "react";
import { getAudio } from "@/utils/data/audioData";
import { EventsOn } from "../../../wailsjs/runtime/runtime";
import { Empty } from "../empty";
import { MusicDropdown } from "../music-actions";

export const MusicList = () => {
  const audioFiles = useDataStore((state) => state.musicFiles);
  const scrollRef = useRef<HTMLDivElement>(null);
  const setAll = usePlayerStore((state) => state.setPlayerStatus);
  const setLoaded = usePlayerStore((state) => state.setLoaded);
  const setTrack = usePlayerStore((state) => state.setCurrentTrack);
  const currentPath = useDataStore((state) => state.currentPath);
  const currentPlaylist = useDataStore((state) => state.currentPlaylist);
  const playlist = usePlaylistStore((state) => state.playlists);

  const [hovered, setHovered] = useState<number | null>(null);

  const setCurrentTrackImage = usePlayerStore(
    (state) => state.setCurrentTrackImage,
  );

  // const getAudioFiles = async () => {
  //   const audioFiles = await getAudio({ hasMore: true, page: 0 });
  //   // setAll(audioFiles);
  //   console.log("files giles mailes");
  //   useDataStore.setState((state) => ({
  //     ...state,
  //     currentPlaylist: null,
  //     musicFiles: [...audioFiles],
  //   }));
  // };

  const handleScroll = async () => {
    const current = scrollRef.current;
    if (!current) return;
    if (currentPlaylist) return;
    if (current.scrollTop + current.clientHeight >= current.scrollHeight) {
      // getAudios(currentPath);
      const newPage = await getAudio({
        page: useQueryStore.getState().page + 1,
      });
      useQueryStore.setState((state) => ({
        ...state,
        page: state.hasMore ? state.page + 1 : state.page,
      }));
      if (!newPage) {
        return;
      }
      useDataStore.setState((state) => ({
        ...state,
        musicFiles: [...state.musicFiles, ...newPage],
      }));
    }
  };

  const loadAudio = (item: any) => {
    console.log("loading file");
    setLoaded(false);
    setTrack(item);

    LoadMusic(item.path)
      .then((res) => {
        console.log("loaded");
        setLoaded(true);
        setTrack(item);
        GetImage().then((res) => {
          setCurrentTrackImage(res.data.image);
        });
        GetStatus().then((res) => {
          setAll(res.data);
        });
        // setAll(JSON.parse(res));
      })
      .catch((error) => {
        console.error("Error loading music:", error);
      });
  };

  // useEffect(() => {
  //   // getAudio();
  //   // useQueryStore.setState((state) => {
  //   //   return { ...state, page: 0 };
  //   // });
  //   useQueryStore.getState().clearQuery();
  //   getAudioFiles();
  // }, [currentPath]);

  // useEffect(() => {
  //   EventsOn("MPV:FILE_LOADED", () => {
  //     setLoaded(true);
  //     // setTrack(item);
  //     GetImage().then((res) => {
  //       setCurrentTrackImage(res.data.image);
  //     });
  //     GetStatus().then((res) => {
  //       setAll(res.data);
  //     });
  //   });
  // }, []);
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
          py={"2"}
          gap={4}
          // borderBottom={"1px white solid"}
          // borderTop={"1px white solid"}
          borderColor={getNeutral("light", 600)}
          _dark={{
            borderColor: getNeutral("dark", 600),
          }}
          borderStyle={"solid"}
          borderWidth={"1px"}
          borderRight={"none"}
          borderLeft={"none"}
          borderTop={"none"}
          fontWeight={500}
        >
          <GridItem whiteSpace={"nowrap"} colSpan={{ base: 3, lg: 1 }}>
            #
          </GridItem>
          <GridItem whiteSpace={"nowrap"} colSpan={{ base: 6, lg: 8 }}>
            Title
          </GridItem>

          <GridItem whiteSpace={"nowrap"} colSpan={{ base: 5, lg: 6 }}>
            Album
          </GridItem>
          <GridItem whiteSpace={"nowrap"} colSpan={{ base: 4, lg: 6 }}>
            Genre
          </GridItem>
          <GridItem whiteSpace={"nowrap"} colSpan={{ base: 4, lg: 2 }}>
            Duration
          </GridItem>
          <GridItem
            whiteSpace={"nowrap"}
            colSpan={{ base: 2, lg: 1 }}
          ></GridItem>
        </Grid>

        <Box
          flex={1}
          minH={0}
          overflow={"auto"}
          onScroll={handleScroll}
          ref={scrollRef}
        >
          {audioFiles && audioFiles.length > 0 ? (
            audioFiles.map((item, idx) => (
              <Grid
                onMouseEnter={() => {
                  setHovered(idx);
                }}
                onMouseLeave={() => setHovered(null)}
                alignItems={"center"}
                templateColumns="repeat(24, 1fr)"
                fontSize={"sm"}
                whiteSpace={"nowrap"}
                gap={4}
                p={"2"}
                key={idx}
                color={getNeutral("light", 200)}
                _dark={{
                  color: getNeutral("dark", 200),
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
                <GridItem colSpan={{ base: 3, lg: 1 }} overflow={"hidden"}>
                  {idx}
                </GridItem>
                <GridItem colSpan={{ base: 6, lg: 8 }} overflow={"hidden"}>
                  <Text whiteSpace={"nowrap"}>{item.title}</Text>
                  <Text
                    whiteSpace={"nowrap"}
                    fontSize={"xs"}
                    color={getNeutral("light", 400)}
                    _dark={{
                      color: getNeutral("dark", 400),
                    }}
                  >
                    {item.artist}
                  </Text>
                </GridItem>

                <GridItem colSpan={{ base: 5, lg: 6 }} overflow={"hidden"}>
                  {item.album ? item.album : "-"}
                </GridItem>
                <GridItem colSpan={{ base: 4, lg: 6 }} overflow={"hidden"}>
                  {item.genre ? item.genre : "-"}
                </GridItem>
                <GridItem colSpan={{ base: 4, lg: 2 }} overflow={"hidden"}>
                  {toHMS(item.duration)}
                </GridItem>
                <GridItem colSpan={{ base: 2, lg: 1 }} overflow={"hidden"}>
                  {hovered === idx && (
                    <MusicDropdown id={item.ipl || null} songId={item.id} />
                  )}
                </GridItem>
              </Grid>
            ))
          ) : (
            <Empty.Music />
          )}
        </Box>
      </Box>
    </Box>
  );
};
