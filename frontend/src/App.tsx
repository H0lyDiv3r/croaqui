//@ts-nocheck

import "./App.css";
import Player from "./features/Player";
import { Box, Button, Image, Text } from "@chakra-ui/react";
import { MusicList } from "./components/music-list";
import { getNeutral } from "./utils";
import { SidebarNavigator } from "./features/sidebar-navigator";
import {
  GetAlbums,
  GetAlbumsWithRoutines,
  ScanForAudio,
} from "../wailsjs/go/media/Media";
import { useEffect, useState } from "react";
import { NavBar } from "./features/navbar";
import { Route, Router, Switch } from "wouter";
import { AlbumDetail, Albums, Library } from "./pages";
import { useScreenSize } from "./hooks";

function App() {
  const handleScan = () => {
    ScanForAudio("/home/yuri/Data").then((res) => {
      console.log("res", res);
    });
  };
  const { isSmall, isMedium, isLarge, isExtraLarge } = useScreenSize();

  return (
    <Box
      display={"flex"}
      flexDir={"column"}
      bg={getNeutral("light", 900)}
      _dark={{ bg: getNeutral("dark", 900), color: getNeutral("dark", 200) }}
      color={getNeutral("light", 200)}
      h={"100vh"}
      id="App"
    >
      {isSmall ? "small" : ""}
      {isMedium ? "medium" : ""}
      {isLarge ? "large" : ""}
      {isExtraLarge ? "extraLarge" : ""}
      {/*<Box h={"5rem"}>aa</Box>*/}
      <NavBar />
      {/*<Button onClick={handleScan}>scan</Button>*/}
      <Switch>
        <Box display={"flex"} flex={1} minH={0}>
          <Route path="/library" component={Library} />
          <Route path="/albums" component={Albums} />
          <Route path="/albums/:id" component={AlbumDetail} />
        </Box>
      </Switch>

      <Player />
    </Box>
  );
}

export default App;
