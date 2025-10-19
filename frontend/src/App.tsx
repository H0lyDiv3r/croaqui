//@ts-nocheck

import "./App.css";
import Player from "./features/Player";
import { Box, Button, Image, Text } from "@chakra-ui/react";
import { MusicList } from "./components/music-list";
import { getNeutral } from "./utils";
import { SidebarNavigator } from "./features/sidebar-navigator";
import { GetAlbums, GetAlbumsWithRoutines } from "../wailsjs/go/media/Media";
import { useState } from "react";
import { NavBar } from "./features/navbar";
import { Route, Router, Switch } from "wouter";
import { Albums, Library } from "./pages";

function App() {
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
      {/*<Box h={"5rem"}>aa</Box>*/}
      <NavBar />

      <Switch>
        <Box flex={1} minH={0}>
          <Route path="/library" component={Library} />
          <Route path="/albums" component={Albums} />
        </Box>
      </Switch>

      <Player />
    </Box>
  );
}

export default App;
