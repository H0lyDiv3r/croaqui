import { useScreenSize } from "@/hooks";
import { useSidebarDisclosure } from "@/store";
import { getNeutral } from "@/utils";
import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export const QueueBar = () => {
  const isOpen = useSidebarDisclosure((state) => state.rightBarOpen);
  const isLeftOpen = useSidebarDisclosure((state) => state.leftBarOpen);
  const switchSide = useSidebarDisclosure((state) => state.switch);
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
            bg={getNeutral("light", 800)}
            _dark={{ bg: getNeutral("dark", 800) }}
            overflowY={"auto"}
          ></Box>
        </Box>
      ) : null}
    </>
  );
};
