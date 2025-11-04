import { useScreenSize } from "@/hooks";
import { usePlayerStore, useQueueStore, useSidebarDisclosure } from "@/store";
import { getNeutral, getQueue } from "@/utils";
import { Box, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export const QueueBar = () => {
  const isOpen = useSidebarDisclosure((state) => state.rightBarOpen);
  const isLeftOpen = useSidebarDisclosure((state) => state.leftBarOpen);
  const switchSide = useSidebarDisclosure((state) => state.switch);
  const queue = useQueueStore((state) => state.items);
  const shuffle = useQueueStore((state) => state.shuffle);
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const { isLarge, isMedium, isSmall } = useScreenSize();
  const handleHide = (target: boolean) => {
    if (isLarge) {
      switchSide();
    }

    useSidebarDisclosure.setState((state) => ({
      ...state,
      rightBarOpen: target,
    }));
  };
  useEffect(() => {
    if (isMedium || isSmall) {
      handleHide(false);
    }
    if (isLarge && isLeftOpen) {
      handleHide(false);
    }
  }, [isLarge, isMedium, isSmall]);

  useEffect(() => {
    const fetchQueue = async () => {
      const queue = await getQueue(currentTrack);
      useQueueStore.setState({ items: queue, playingIndex: 0 });
    };

    if (currentTrack.path) {
      fetchQueue();
    }
  }, [shuffle]);

  return (
    <>
      {isOpen ? (
        <Box
          px={2}
          h={"100%"}
          display={"flex"}
          gap={2}
          flexDirection={"column"}
          width={"350px"}
        >
          <Box
            p={2}
            flex={1}
            borderRadius={"md"}
            // bg={getNeutral("light", 800)}
            // _dark={{ bg: getNeutral("dark", 800) }}
            overflowY={"auto"}
            mb={2}
          >
            {queue && queue.length > 0 ? (
              <Box>
                {queue.map((song: any, idx: number) => (
                  <Box
                    key={idx}
                    p={2}
                    bg={getNeutral("light", 800)}
                    _dark={{
                      bg: getNeutral("dark", 800),
                      color:
                        currentTrack.path === song.path
                          ? "brand.500"
                          : getNeutral("dark", 200),
                    }}
                    my={2}
                    borderRadius={"md"}
                    textAlign={"left"}
                    color={
                      currentTrack.path === song.path
                        ? "brand.500"
                        : getNeutral("light", 200)
                    }
                  >
                    <Text
                      whiteSpace={"nowrap"}
                      fontWeight={600}
                      overflow={"hidden"}
                    >
                      {song.title}
                    </Text>
                    <Text
                      fontSize={"xs"}
                      color={
                        currentTrack.path === song.path
                          ? "brand.500"
                          : getNeutral("light", 200)
                      }
                      _dark={{
                        color:
                          currentTrack.path === song.path
                            ? "brand.700"
                            : getNeutral("dark", 300),
                      }}
                    >
                      {song.artist}
                    </Text>
                  </Box>
                ))}
              </Box>
            ) : (
              <Box p={2}>No songs in queue</Box>
            )}
          </Box>
        </Box>
      ) : null}
    </>
  );
};
