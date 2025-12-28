import { useDataStore, useQueueStore } from "@/store";
import { Box, Grid, GridItem, Text, useDisclosure } from "@chakra-ui/react";

import { getNeutral, toHMS } from "@/utils";

import { useLayoutEffect, useRef, useState } from "react";
import { Empty } from "../empty";
import { loadAudio } from "@/utils/action/playerActions";
import MusicDropdown from "../music-actions/MusicDropDown";

import { FixedSizeList } from "react-window";
import { TbDots } from "react-icons/tb";
import { ChakraIcon } from "../ChackraIcon";

const List: any = FixedSizeList;
export const MusicList = ({
  handleGetQueue,
}: {
  handleGetQueue: (song?: { [key: string]: any }) => Promise<any>;
}) => {
  const audioFiles = useDataStore((state) => state.musicFiles);

  const { open, setOpen } = useDisclosure();

  const [idxOfDropdown, setIdxOfDropdown] = useState(-1);
  const [dropdownPos, setDropdownPos] = useState({ x: 0, y: 0 });

  const heightRef = useRef<HTMLElement>(null);
  const [height, setHeight] = useState(100);

  useLayoutEffect(() => {
    var cancelResize: NodeJS.Timeout;
    const resizeObserver = new ResizeObserver((entries) => {
      clearTimeout(cancelResize);
      cancelResize = setTimeout(() => {
        setHeight(entries[0].contentRect.height);
      }, 100);
    });

    if (heightRef.current) resizeObserver.observe(heightRef.current);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(cancelResize);
    };
  }, []);
  return (
    <Box height={"100%"} px={2}>
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

        <Box flex={1} minH={0} overflow={"auto"} ref={heightRef}>
          {audioFiles && audioFiles.length > 0 ? (
            <List
              className="scroll"
              itemCount={audioFiles.length}
              itemSize={60}
              height={height}
              width={"100%"}
            >
              {({ index, style }: { index: number; style: any }) => {
                return (
                  <MusicRow
                    index={index}
                    style={style}
                    audioFiles={audioFiles[index]}
                    handleGetQueue={handleGetQueue}
                    setIdxOfDropdown={setIdxOfDropdown}
                    setOpen={setOpen}
                    setDropdownPos={setDropdownPos}
                  />
                );
              }}
            </List>
          ) : (
            <Empty.Music />
          )}
        </Box>
      </Box>
      {idxOfDropdown >= 0 ? (
        <MusicDropdown
          id={audioFiles[idxOfDropdown].ipl || null}
          song={audioFiles[idxOfDropdown]}
          open={open}
          setOpen={setOpen}
          position={dropdownPos}
          clearIndexOfDropdown={() => setIdxOfDropdown(-1)}
        />
      ) : null}
    </Box>
  );
};

const MusicRow = ({
  index,
  style,
  audioFiles,
  handleGetQueue,
  setIdxOfDropdown,
  setOpen,
  setDropdownPos,
}: {
  index: number;
  style: any;
  audioFiles: any;
  handleGetQueue: any;
  setIdxOfDropdown: any;
  setOpen: any;
  setDropdownPos: any;
}) => {
  const setQueue = useQueueStore((state) => state.setQueue);
  const setPlayingIndex = useQueueStore((state) => state.setPlayingIndex);

  const handleLoadAudio = async (item: any) => {
    setPlayingIndex(0);
    await loadAudio(item);
    const queue = await handleGetQueue(item);
    setQueue(queue);
  };

  return (
    <>
      <Grid
        style={style}
        alignItems={"center"}
        templateColumns="repeat(24, 1fr)"
        fontSize={"sm"}
        whiteSpace={"nowrap"}
        gap={4}
        p={"2"}
        color={getNeutral("light", 200)}
        _dark={{
          color: getNeutral("dark", 200),
        }}
        _hover={{
          "& [data-hover-target]": {
            opacity: 1,
            pointerEvents: "auto",
          },
          bg: getNeutral("light", 700),
          cursor: "pointer",
          _dark: {
            bg: getNeutral("dark", 700),
          },
        }}
        onClick={() => {
          handleLoadAudio(audioFiles);
        }}
      >
        <GridItem colSpan={{ base: 3, lg: 1 }} overflow={"hidden"}>
          {index + 1}
        </GridItem>
        <GridItem colSpan={{ base: 6, lg: 8 }} overflow={"hidden"}>
          <Text whiteSpace={"nowrap"}>{audioFiles.title}</Text>
          <Text
            whiteSpace={"nowrap"}
            fontSize={"xs"}
            color={getNeutral("light", 400)}
            _dark={{
              color: getNeutral("dark", 400),
            }}
          >
            {audioFiles.artist}
          </Text>
        </GridItem>

        <GridItem colSpan={{ base: 5, lg: 6 }} overflow={"hidden"}>
          {audioFiles.album ? audioFiles.album : "-"}
        </GridItem>
        <GridItem colSpan={{ base: 4, lg: 6 }} overflow={"hidden"}>
          {audioFiles.genre ? audioFiles.genre : "-"}
        </GridItem>
        <GridItem colSpan={{ base: 4, lg: 2 }} overflow={"hidden"}>
          {toHMS(audioFiles.duration)}
        </GridItem>
        <GridItem colSpan={{ base: 2, lg: 1 }} overflow={"hidden"}>
          <Box
            textAlign={"center"}
            data-hover-target
            opacity={0}
            pointerEvents={"none"}
            onClick={(e) => {
              e.stopPropagation();

              setOpen(true);
              setIdxOfDropdown(index);
              setDropdownPos({ x: e.pageX, y: e.pageY });
            }}
          >
            <ChakraIcon icon={TbDots} />
          </Box>
        </GridItem>
      </Grid>
    </>
  );
};
