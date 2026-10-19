//@ts-nocheck
import { ChakraIcon } from "@/components/ChackraIcon";
import { Logo, Navigation, SearchBar, Settings } from "@/components/nav";
import { useScreenSize } from "@/hooks";
import { getNeutral } from "@/utils";
import {
  Box,
  Button,
  Grid,
  GridItem,
  Input,
  Menu,
  Portal,
  Text,
} from "@chakra-ui/react";
import { FaBars } from "react-icons/fa6";
import { HiMiniBars2 } from "react-icons/hi2";
import { Link } from "wouter";

import { useState } from "react";
import { FaTowerBroadcast } from "react-icons/fa6";

import { Connect } from "../../../wailsjs/go/stream/Stream";

export const NavBar = () => {
  const { isSmall, isMedium, isLarge, isExtraLarge } = useScreenSize();
  const [streamOpen, setStreamOpen] = useState(false);
  const [roomId, setRoomId] = useState("");

  return (
    <Box
      className="navbar"
      display={"flex"}
      alignItems={"center"}
      height={"5rem"}
      justifyContent={"center"}
    >
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
        width={isExtraLarge ? "80%" : "95%"}
        gap={"4"}
      >
        <Box flexShrink={0} display={"flex"} alignItems={"center"}>
          <Logo />
        </Box>
        <Box flex={1} maxW={"420px"} mx={"auto"}>
          <SearchBar />
        </Box>
        <Box
          display={"flex"}
          gap={"3"}
          justifyContent={"end"}
          alignItems={"center"}
          flexShrink={0}
        >
          <Button
            size="xs"
            onClick={() => {
              (window as any)?.go?.stream?.Stream?.StreamAudio?.("");
            }}
          >
            Send
          </Button>
          <Button
            size="xs"
            onClick={() => {
              (window as any)?.go?.stream?.Stream?.AcceptAudio?.();
            }}
          >
            Accept
          </Button>
          <Box
            cursor={"pointer"}
            title="P2P Stream Test"
            onClick={() => setStreamOpen(true)}
            display={"flex"}
            alignItems={"center"}
          >
            <ChakraIcon icon={FaTowerBroadcast} boxSize={5} />
          </Box>
          <Navigation />
          <Settings />
        </Box>
      </Box>
    </Box>
  );
};

const NavMenu = () => {
  return (
    <Box>
      <Menu.Root>
        <Menu.Trigger>
          <ChakraIcon icon={HiMiniBars2} />
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content
              bg={getNeutral("light", 800)}
              _dark={{
                bg: getNeutral("dark", 800),
                borderColor: getNeutral("dark", 700),
                color: getNeutral("dark", 300),
              }}
              border="1px solid"
              borderColor={getNeutral("light", 700)}
              color={getNeutral("light", 300)}
            >
              <Menu.Item>
                <Link href="/">Library</Link>
              </Menu.Item>
              <Menu.Item>
                <Link href="/albums">Albums</Link>
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </Box>
  );
};
