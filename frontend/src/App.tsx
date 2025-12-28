import "./App.css";
import Player from "./features/Player";
import { Box, Text } from "@chakra-ui/react";
import { getNeutral, shuffleQueue } from "./utils";
import { useEffect, useLayoutEffect, useState } from "react";
import { NavBar } from "./features/navbar";
import { Route, Switch, useRoute } from "wouter";
import { Library } from "./pages";
import { useScreenSize, useShowToast } from "./hooks";
import { EventsOn } from "../wailsjs/runtime";
import { WindowBar } from "./components/WindowBar";
import {
  useDataStore,
  useGeneralStore,
  usePlayerStore,
  useQueueStore,
  useSidebarDisclosure,
} from "./store";
import { MiniPlayer } from "./features/miniPlayer";
import { AlbumsLayout } from "./pages/albums/AlbumsLayout";
import { SearchResults } from "./pages/searchResults";
import { SidebarNavigator } from "./features/sidebar-navigator";
import { QueueBar } from "./features/queue-bar";
import { GetStatus } from "wailsjs/go/player/Player";
import {
  handleNext,
  handlePrev,
  loadAudio,
  setMpvPlayerStats,
} from "./utils/action";

function App() {
  const { showToast } = useShowToast();

  const miniPlayerOpen = useGeneralStore((state) => state.miniPlayerOpen);
  const currentPlaylist = useDataStore((state) => state.currentPlaylist);
  const musicListPath = useDataStore((state) => state.musicListPath);
  const shuffle = useQueueStore((state) => state.shuffle);
  const togglePaused = usePlayerStore((state) => state.togglePaused);
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const muted = usePlayerStore((state) => state.muted);
  const speed = usePlayerStore((state) => state.speed);
  const volume = usePlayerStore((state) => state.volume);
  const position = usePlayerStore((state) => state.position);

  const setPlayerStatus = usePlayerStore((state) => state.setPlayerStatus);
  const [scanMsg, setScanMsg] = useState("");
  const { isSmall } = useScreenSize();

  const [match, params] = useRoute("/albums/:albumId");
  const setPlayingIndex = useQueueStore((state) => state.setPlayingIndex);

  const handleLoadAudio = async (item: any) => {
    setPlayingIndex(0);
    await loadAudio(item, true);
    // const queue = await handleGetQueue(item);
    // setQueue(queue);
  };

  useLayoutEffect(() => {
    // setting persisted state
    if (currentTrack) {
      handleLoadAudio(currentTrack).then(() => {
        setMpvPlayerStats({
          muted,
          speed,
          volume,
          paused: true,
          position,
          duration: 0,
        });
      });
    }

    const cancelToastError = EventsOn("toast:err", (err) => {
      showToast("error", err.message);
    });
    const cancelPlayerError = EventsOn("player_error", (err) => {
      showToast("error", err.message);
    });
    const cancelToastSuccess = EventsOn("toast:success", (msg) => {
      showToast("success", msg);
    });

    const cancelFileLoaded = EventsOn("MPV:FILE_LOADED", () => {
      GetStatus().then((res) => {
        setPlayerStatus(res.data);
      });
    });

    const cancelScannerMessage = EventsOn("scanner:msg", (msg) => {
      setScanMsg(msg);
      setTimeout(() => setScanMsg(""), 3000);
    });

    const cancelMpris = EventsOn("MPRIS", (data) => {
      switch (data.type) {
        case "playpause":
          togglePaused(data.action);
          break;
        case "next":
          handleNext();
          break;
        case "previous":
          handlePrev();
          break;
        default:
          break;
      }
    });
    return () => {
      cancelToastError();
      cancelPlayerError();
      cancelToastSuccess();
      cancelFileLoaded();
      cancelMpris();
      cancelScannerMessage();
    };
  }, []);
  useEffect(() => {
    useSidebarDisclosure.setState({ leftBarOpen: false, rightBarOpen: false });
  }, [isSmall]);
  useEffect(() => {
    shuffleQueue();
  }, [shuffle]);
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
        <Box height={"100%"} display={"flex"} flexDirection={"column"}>
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
                      ? String(params.albumId)
                      : musicListPath,
                  shuffle: shuffle,
                }}
              />
            </Box>
          </Box>

          <Player />

          <Box
            textAlign={"left"}
            width={"100%"}
            height={"16px"}
            overflow={"hidden"}
            color={getNeutral("light", 300)}
            _dark={{
              color: getNeutral("dark", 300),
            }}
            pos={"absolute"}
            bottom={0}
            px={1}
          >
            <>
              {scanMsg && scanMsg !== "" && (
                <Text fontSize={"xs"}>{scanMsg}</Text>
              )}
            </>
          </Box>
        </Box>
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
