import "./App.css";
import Player from "./features/Player";
import { Box, Button, Image, Text } from "@chakra-ui/react";
import { MusicList } from "./components/music-list";
import { getNeutral } from "./utils";
import { SidebarNavigator } from "./features/sidebar-navigator";
import { ScanForAudio } from "../wailsjs/go/media/Media";
import { useEffect, useLayoutEffect, useState } from "react";
import { NavBar } from "./features/navbar";
import { Route, Router, Switch } from "wouter";
import { AlbumDetail, Albums, Library } from "./pages";
import { useScreenSize, useShowToast } from "./hooks";
import { EventsOn } from "../wailsjs/runtime";
import { usePlayerStore } from "./store";
import { GetImage, GetStatus } from "wailsjs/go/player/Player";

function App() {
  const setAll = usePlayerStore((state) => state.setPlayerStatus);
  const setLoaded = usePlayerStore((state) => state.setLoaded);
  const setCurrentTrackImage = usePlayerStore(
    (state) => state.setCurrentTrackImage,
  );
  const handleScan = () => {
    ScanForAudio("/home/yuri/Data").then((res) => {
      console.log("res", res);
    });
  };
  const { showToast } = useShowToast();
  const { isSmall, isMedium, isLarge, isExtraLarge } = useScreenSize();

  useLayoutEffect(() => {
    EventsOn("toast:err", (err) => {
      console.log("error emitted");
      showToast("error", err.message);
    });

    EventsOn("toast:success", (msg) => {
      console.log("success emitted");
      showToast("success", msg);
    });

    EventsOn("MPV:FILE_LOADED", () => {
      setLoaded(true);
      // setTrack(item);
      GetImage().then((res) => {
        setCurrentTrackImage(res.data.image);
      });
      GetStatus().then((res) => {
        setAll(res.data);
      });
    });
  }, []);

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
      {/*{isSmall ? "small" : ""}
      {isMedium ? "medium" : ""}
      {isLarge ? "large" : ""}
      {isExtraLarge ? "extraLarge" : ""}*/}
      {/*<Box h={"5rem"}>aa</Box>*/}
      <NavBar />
      {/*<Button onClick={() => showToast("success", "Scan started")}>scan</Button>*/}
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
