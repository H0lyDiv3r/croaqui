import "./App.css";
import Player from "./features/Player";
import { Box } from "@chakra-ui/react";
import { getNeutral } from "./utils";
import { useLayoutEffect } from "react";
import { NavBar } from "./features/navbar";
import { Route, Switch } from "wouter";
import { AlbumDetail, Albums, Library } from "./pages";
import { useShowToast } from "./hooks";
import { EventsOn } from "../wailsjs/runtime";
import { WindowBar } from "./components/WindowBar";
import { useGeneralStore } from "./store";
import { ChakraIcon } from "./components/ChackraIcon";
import { BsGripVertical } from "react-icons/bs";
import { MiniPlayer } from "./features/miniPlayer";

function App() {
  const { showToast } = useShowToast();

  const miniPlayerOpen = useGeneralStore((state) => state.miniPlayerOpen);

  useLayoutEffect(() => {
    EventsOn("toast:err", (err) => {
      showToast("error", err.message);
    });
    EventsOn("player_error", (err) => {
      showToast("error", err.message);
    });
    EventsOn("toast:success", (msg) => {
      showToast("success", msg);
    });

    // EventsOn("MPV:FILE_LOADED", () => {
    //   // showToast("info", "loaded");
    //   console.log("file loaded coming from thef fring");
    //   setLoaded(true);
    //   // setTrack(item);
    //   // GetImage().then((res) => {
    //   //   setCurrentTrackImage(res.data.image);
    //   // });
    //   GetStatus().then((res) => {
    //     console.log("about to set all", res);
    //     setAll(res.data);
    //   });
    // });
  }, []);

  return (
    <Box
      display={"flex"}
      flexDir={"column"}
      bg={miniPlayerOpen ? "rgba(255,255,255,0.5)" : getNeutral("light", 900)}
      _dark={{
        bg: miniPlayerOpen ? "rgba(0,0,0,0.5)" : getNeutral("dark", 900),
        color: getNeutral("dark", 200),
      }}
      color={getNeutral("light", 200)}
      h={"100vh"}
      id="App"
      borderRadius={"md"}
    >
      {miniPlayerOpen ? (
        <Box height={"100%"}>
          <MiniPlayer />
        </Box>
      ) : (
        <>
          <WindowBar />
          <NavBar />
          <Switch>
            <Box display={"flex"} flex={1} minH={0}>
              <Route path="/library" component={Library} />
              <Route path="/albums" component={Albums} />
              <Route path="/albums/:id" component={AlbumDetail} />
            </Box>
          </Switch>

          <Player />
        </>
      )}
    </Box>
  );
}

export default App;
