import { ChakraIcon } from "@/components/ChackraIcon";
import { DirTree } from "@/components/dir-tree";
import { PathBar } from "@/components/path-bar";
import { useScreenSize } from "@/hooks";
import { getNeutral } from "@/utils";
import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { RiExpandLeftFill } from "react-icons/ri";
import { RiExpandRightFill } from "react-icons/ri";
import { useSidebarDisclosure } from "@/store/sidebarDisclosure";
export const SidebarNavigator = () => {
  const isOpen = useSidebarDisclosure((state) => state.leftBarOpen);
  const switchSide = useSidebarDisclosure((state) => state.switch);
  const { isSmall, isLarge } = useScreenSize();

  const handleHide = (target: boolean) => {
    if (isLarge) {
      switchSide();
    }

    useSidebarDisclosure.setState((state) => ({
      ...state,
      leftBarOpen: target,
    }));
  };

  useEffect(() => {
    if (isSmall) {
      handleHide(false);
    }
  }, [isSmall]);
  return (
    <Box position={"relative"} height={"100%"}>
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
            as={"button"}
            onClick={() => handleHide(false)}
            p={2}
            width={"fit"}
            borderRadius={"md"}
            bg={"brand.400"}
            border={"1px solid"}
            color={"brand.800"}
            borderColor={getNeutral("light", 600)}
            _dark={{
              borderColor: getNeutral("dark", 600),
            }}
            _hover={{
              cursor: "pointer",
              bg: "brand.500",
            }}
          >
            <ChakraIcon icon={RiExpandLeftFill} />
          </Box>
          <PathBar />
          <Box
            my={2}
            p={2}
            flex={1}
            borderRadius={"md"}
            bg={getNeutral("light", 800)}
            _dark={{ bg: getNeutral("dark", 800) }}
            overflowY={"auto"}
          >
            <DirTree />
          </Box>
        </Box>
      ) : (
        <SidebarNavigatorMobile onExpand={() => handleHide(true)} />
      )}
    </Box>
  );
};

const SidebarNavigatorMobile = ({ onExpand }: { onExpand: () => void }) => {
  return (
    <Box
      position={"absolute"}
      top={"50%"}
      bg={"brand.400"}
      border={"1px solid"}
      color={"brand.800"}
      as={"button"}
      borderColor={getNeutral("light", 600)}
      _dark={{
        borderColor: getNeutral("dark", 600),
      }}
      p={"4"}
      borderRightRadius={"md"}
      shadow={"2xl"}
      _hover={{
        cursor: "pointer",
        bg: "brand.500",
      }}
      onClick={onExpand}
    >
      <ChakraIcon icon={RiExpandRightFill} boxSize={5} />
    </Box>
  );
};
