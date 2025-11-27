import { useGeneralStore } from "@/store/generalStore";
import { getNeutral } from "@/utils";
import { Box, Button, Text } from "@chakra-ui/react";
import { useRef } from "react";
import { ChakraIcon } from "../ChackraIcon";
import { FaChevronRight, FaHouse } from "react-icons/fa6";
import { useDataStore } from "@/store";
import { useLocation } from "wouter";

export const PathBar = ({
  currentPath,
  setCurrentPath,
}: {
  currentPath: string;
  setCurrentPath: (path: string) => void;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [_, setLocation] = useLocation();

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollLeft += e.deltaY;
  };
  return (
    <>
      <Box
        borderColor={getNeutral("light", 700)}
        borderStyle={"solid"}
        borderWidth={"1px"}
        borderRadius={"md"}
        color={getNeutral("light", 100)}
        bg={getNeutral("light", 800)}
        _dark={{
          color: getNeutral("dark", 100),
          borderColor: getNeutral("dark", 700),
          bg: getNeutral("dark", 800),
        }}
        p={2}
        display="flex"
        alignItems="center"
        gap={2}
      >
        <ChakraIcon
          onClick={(e) => {
            e.stopPropagation();
            setCurrentPath("");
          }}
          icon={FaHouse}
          boxSize={5}
          _hover={{
            cursor: "pointer",
          }}
        ></ChakraIcon>
        |
        <Box
          width={"100%"}
          overflowX={"auto"}
          display={"flex"}
          alignItems={"center"}
          ref={scrollRef}
          onWheel={handleWheel}
          css={{
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE 10+
            "&::-webkit-scrollbar": {
              display: "none", // Chrome, Safari, Edge (WebKit/Blink)
              height: "0px",
            },
          }}
        >
          {currentPath.split("/").map((path, index) => (
            <Box
              _hover={{
                cursor: "pointer",
                color: getNeutral("light", 300),
                _dark: { color: getNeutral("dark", 300) },
              }}
              whiteSpace={"nowrap"}
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setLocation("/");
                setCurrentPath(
                  currentPath
                    .split("/")
                    .slice(0, index + 1)
                    .join("/"),
                );
              }}
            >
              {path}
              {index < currentPath.split("/").length - 1 && index != 0 && (
                <ChakraIcon
                  icon={FaChevronRight}
                  boxSize={3}
                  mx={2}
                ></ChakraIcon>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
};
