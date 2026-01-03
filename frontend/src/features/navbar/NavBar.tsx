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
  Menu,
  Portal,
  Text,
} from "@chakra-ui/react";
import { FaBars } from "react-icons/fa6";
import { HiMiniBars2 } from "react-icons/hi2";
import { Link } from "wouter";

export const NavBar = () => {
  const { isSmall, isMedium, isLarge, isExtraLarge } = useScreenSize();
  return (
    <Box
      className="navbar"
      display={"flex"}
      alignItems={"center"}
      height={"5rem"}
      justifyContent={"center"}
      overflow={"hidden"}
    >
      <Grid
        templateColumns="repeat(24, 1fr)"
        width={isExtraLarge ? "80%" : "95%"}
        gap={"6"}
      >
        <GridItem
          colSpan={{ base: 6, lg: 8 }}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Logo />
        </GridItem>
        <GridItem colSpan={{ base: 12, lg: 8 }}>
          <SearchBar />
        </GridItem>
        <GridItem
          colSpan={{ base: 6, lg: 8 }}
          display={"flex"}
          gap={"6"}
          justifyContent={"end"}
          alignItems={"center"}
        >
          {isSmall || isMedium ? (
            <>
              {/*<ChakraIcon icon={HiMiniBars2} />*/}
              <Navigation />
              <Settings />
            </>
          ) : (
            <>
              <Navigation />
              <Settings />
            </>
          )}
        </GridItem>
      </Grid>
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
