import { ChakraIcon } from "@/components/ChackraIcon";
import { Empty } from "@/components/empty";
import { useScreenSize } from "@/hooks";
import {
  useDataStore,
  usePlayerStore,
  useQueueStore,
  useSidebarDisclosure,
} from "@/store";
import { QueueInfo, Song } from "@/types";
import { getNeutral } from "@/utils";
import { loadFromQueue } from "@/utils/action";
import { Box, Image, Tabs, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaRegFolderOpen } from "react-icons/fa6";
import { IoFolderOpenOutline } from "react-icons/io5";

const TabsList: any = Tabs.List;
const TabsContent: any = Tabs.Content;
const TabsTrigger: any = Tabs.Trigger;
export const QueueBar = ({ queueInfo }: { queueInfo: QueueInfo }) => {
  const isOpen = useSidebarDisclosure((state) => state.rightBarOpen);
  const isLeftOpen = useSidebarDisclosure((state) => state.leftBarOpen);
  const switchSide = useSidebarDisclosure((state) => state.switch);
  const queue = useQueueStore((state) => state.items);
  const playIndex = useQueueStore((state) => state.playingIndex);
  const loop = useQueueStore((state) => state.loop);
  const shuffle = useQueueStore((state) => state.shuffle);
  const shuffleIndex = useQueueStore((state) => state.shuffleIndex);
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const currentPlaylist = useDataStore((state) => state.currentPlaylist);

  const musicListPath = useDataStore((state) => state.musicListPath);
  const { isLarge, isMedium, isSmall } = useScreenSize();

  const calculateUpNext = () => {
    switch (loop) {
      case 0:
        return queue.length > playIndex + 1 ? playIndex + 1 : -1;
      case 1:
        return (playIndex + 1) % queue.length;
      default:
        return playIndex;
    }
  };
  const handleHide = (target: boolean) => {
    useSidebarDisclosure.setState((state) => ({
      ...state,
      rightBarOpen: target,
    }));
  };
  const getSongAtShuffleIndex = (idx: number): Song | null => {
    return shuffle && shuffleIndex ? queue[shuffleIndex[idx]] : null;
  };

  useEffect(() => {
    console.log("i will get metadata here", shuffleIndex);
  }, [shuffleIndex]);

  return (
    <>
      {isOpen ? (
        <Box
          fontFamily={"rubik"}
          px={2}
          h={"100%"}
          display={"flex"}
          gap={2}
          flexDirection={"column"}
          width={"350px"}
        >
          <Tabs.Root
            defaultValue="track"
            h={"100%"}
            display={"flex"}
            flexDirection={"column"}
            variant={"plain"}
          >
            <TabsList
              border={"none"}
              display={"flex"}
              alignItems={"center"}
              px={2}
            >
              <Box
                _hover={{ cursor: "pointer" }}
                onClick={() => {
                  handleHide(false);
                }}
              >
                <ChakraIcon icon={IoFolderOpenOutline} boxSize={5} />
              </Box>
              <Box
                display={"flex"}
                justifyContent={"end"}
                width={"100%"}
                flex={1}
              >
                <TabsTrigger value="track" fontSize={"md"}>
                  track
                </TabsTrigger>
                <TabsTrigger value="queue" fontSize={"md"}>
                  queue
                </TabsTrigger>
              </Box>
            </TabsList>
            <TabsContent value="track" minH={0} flex={1} overflowY="auto">
              <Box>
                {currentTrack.path ? (
                  <Box
                    bg={getNeutral("light", 800)}
                    _dark={{
                      bg: getNeutral("dark", 800),
                      borderColor: getNeutral("dark", 700),
                    }}
                    p={2}
                    borderRadius={"lg"}
                    border={"1px solid"}
                    borderColor={getNeutral("light", 700)}
                  >
                    <Image
                      borderRadius={"md"}
                      src={
                        currentTrack.image
                          ? `${currentTrack.image}`
                          : "./trackImage.svg"
                      }
                      width={"100%"}
                      height={"100%"}
                      fit={"cover"}
                    />
                    <Box mt={4} textAlign={"center"}>
                      <Text fontSize={"md"} fontWeight={500} mb={2}>
                        {currentTrack.title || "No track"}
                      </Text>
                      <Text
                        fontSize={"sm"}
                        color={getNeutral("light", 300)}
                        mb={4}
                      >
                        {currentTrack.artist || "Unknown artist"}
                      </Text>
                    </Box>
                  </Box>
                ) : (
                  <Empty.Track />
                )}
              </Box>
              <Box mt={8}>
                <Box
                  mb={2}
                  textAlign={"center"}
                  display={"flex"}
                  justifyContent={"left"}
                >
                  <Text fontSize={"lg"}>Up Next</Text>
                </Box>
                <Box
                  bg={getNeutral("light", 800)}
                  _dark={{ bg: getNeutral("dark", 800) }}
                  display={"flex"}
                  flexDirection={"column"}
                  alignItems={"flex-start"}
                  p={2}
                  gap={1}
                  borderRadius={"sm"}
                >
                  <Text fontSize={"md"} fontWeight={600}>
                    {calculateUpNext() + 1
                      ? queue[calculateUpNext()]?.title
                      : "End of Queue"}
                  </Text>
                  <Text
                    fontSize={"sm"}
                    color={getNeutral("light", 400)}
                    _dark={{ color: getNeutral("dark", 400) }}
                  >
                    {queue[calculateUpNext()]?.artist || "Unknown artist"}
                  </Text>
                </Box>
              </Box>
            </TabsContent>
            <TabsContent
              value="queue"
              minH={0}
              flex={1}
              overflowY={"auto"}
              my={2}
            >
              <Box
                flex={1}
                borderRadius={"md"}
                // bg={getNeutral("light", 800)}
                // _dark={{ bg: getNeutral("dark", 800) }}
                overflowY={"auto"}
              >
                {queue && queue.length > 0 ? (
                  <Box>
                    {queue.map((song: any, idx: number) => (
                      <Box
                        display={"flex"}
                        alignItems={"center"}
                        key={idx}
                        p={2}
                        borderRadius={"md"}
                        textAlign={"left"}
                        _hover={{
                          cursor: "pointer",
                          bg: getNeutral("light", 800),
                        }}
                        color={
                          currentTrack.path ===
                          (getSongAtShuffleIndex(idx)
                            ? getSongAtShuffleIndex(idx)?.path
                            : song.path)
                            ? "brand.500"
                            : getNeutral("light", 300)
                        }
                        _dark={{
                          color:
                            currentTrack.path ===
                            (getSongAtShuffleIndex(idx)
                              ? getSongAtShuffleIndex(idx)?.path
                              : song.path)
                              ? "brand.400"
                              : getNeutral("dark", 300),
                          _hover: {
                            bg: getNeutral("dark", 800),
                          },
                        }}
                        onClick={() => {
                          loadFromQueue(idx);
                        }}
                      >
                        <Box>
                          <Text
                            whiteSpace={"nowrap"}
                            fontWeight={500}
                            overflow={"hidden"}
                          >
                            {getSongAtShuffleIndex(idx)
                              ? getSongAtShuffleIndex(idx)?.title
                              : song.title}
                          </Text>
                          <Text
                            fontSize={"xs"}
                            color={
                              currentTrack.path === song.path
                                ? "brand.500"
                                : getNeutral("light", 300)
                            }
                            _dark={{
                              color:
                                currentTrack.path ===
                                (getSongAtShuffleIndex(idx)
                                  ? getSongAtShuffleIndex(idx)?.path
                                  : song.path)
                                  ? "brand.700"
                                  : getNeutral("dark", 300),
                            }}
                          >
                            {song.artist}
                            {getSongAtShuffleIndex(idx)
                              ? getSongAtShuffleIndex(idx)?.artist
                              : song.artist}
                          </Text>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Box p={2}>No songs in queue</Box>
                )}
              </Box>
            </TabsContent>
          </Tabs.Root>
        </Box>
      ) : null}
    </>
  );
};

const PlayingAnimation = () => {
  const MotionBox = motion(Box);
  return (
    <Box display={"flex"} gap={"1px"} h={"100%"}>
      <MotionBox
        as="div"
        w={"4px"}
        h={"12px"}
        bg="brand.500"
        animate={{
          scaleY: [0.7, 1, 0.2, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
        }}
        style={{ originY: 1 }} // ← Bottom anchor (0 = top, 1 = bottom)
      />
      <MotionBox
        as="div"
        w={"4px"}
        h={"12px"}
        bg="brand.500"
        animate={{
          scaleY: [0.3, 1, 0.8, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
        }}
        style={{ originY: 1 }} // ← Bottom anchor (0 = top, 1 = bottom)
      />
      <MotionBox
        as="div"
        w={"4px"}
        h={"12px"}
        bg="brand.500"
        animate={{
          scaleY: [0.6, 1, 0.6, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
        }}
        style={{ originY: 1 }} // ← Bottom anchor (0 = top, 1 = bottom)
      />
    </Box>
  );
};
