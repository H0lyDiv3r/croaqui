import "./App.css";
import Player from "./features/Player";
import { Box } from "@chakra-ui/react";
import { getNeutral } from "./utils";
import { useLayoutEffect } from "react";
import { NavBar } from "./features/navbar";
import { Route, Switch, useRoute } from "wouter";
import { Library } from "./pages";
import { useShowToast } from "./hooks";
import { EventsOn } from "../wailsjs/runtime";
import { WindowBar } from "./components/WindowBar";
import {
  useDataStore,
  useGeneralStore,
  usePlayerStore,
  useQueueStore,
} from "./store";
import { ChakraIcon } from "./components/ChackraIcon";
import { BsGripVertical } from "react-icons/bs";
import { MiniPlayer } from "./features/miniPlayer";
import { AlbumsLayout } from "./pages/albums/AlbumsLayout";
import { SearchResults } from "./pages/searchResults";
import { SidebarNavigator } from "./features/sidebar-navigator";
import { QueueBar } from "./features/queue-bar";
import { GetImage, GetStatus } from "wailsjs/go/player/Player";

function App() {
  const { showToast } = useShowToast();

  const miniPlayerOpen = useGeneralStore((state) => state.miniPlayerOpen);
  const currentPlaylist = useDataStore((state) => state.currentPlaylist);
  const musicListPath = useDataStore((state) => state.musicListPath);
  const shuffle = useQueueStore((state) => state.shuffle);
  const setCurrentTrackImage = usePlayerStore(
    (state) => state.setCurrentTrackImage,
  );
  const setPlayerStatus = usePlayerStore((state) => state.setPlayerStatus);

  const [match, params] = useRoute("/albums/:albumId");

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

    EventsOn("MPV:FILE_LOADED", () => {
      GetImage().then((res) => {
        setCurrentTrackImage(res.data.image);
      });
      GetStatus().then((res) => {
        console.log("about to set all", res);
        setPlayerStatus(res.data);
      });
    });
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
          <Box display={"flex"} flex={1} minH={0}>
            <Switch>
              <Route path="/albums" nest>
                <Box display={"flex"} height={"100%"} flex={1}>
                  <AlbumsLayout />
                </Box>
              </Route>
              <Route path="/" nest>
                <RootLayout />
              </Route>
            </Switch>
            <Box height={"100%"}>
              <QueueBar
                queueInfo={{
                  type: currentPlaylist ? "playlist" : match ? "album" : "dir",
                  args: currentPlaylist
                    ? String(currentPlaylist || 0)
                    : match
                      ? String(params)
                      : musicListPath,
                  shuffle: shuffle,
                }}
              />
            </Box>
          </Box>

          <Player />
        </>
      )}
    </Box>
  );
}

export default App;

export const RootLayout = () => {
  return (
    <Box display={"flex"} height={"100%"} flex={1}>
      <Box
        // bg={getNeutral("light", 800)}
        // _dark={{ bg: getNeutral("dark", 800) }}
        height={"100%"}
      >
        <SidebarNavigator />
      </Box>
      <Box flex={1} height={"100%"}>
        <Switch>
          <Route path="/" component={Library} />
          <Route path="/search-results" component={SearchResults} />
        </Switch>
      </Box>
    </Box>
  );
};
