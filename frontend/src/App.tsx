//@ts-nocheck
//
import { useEffect, useState } from "react";
import logo from "./assets/images/logo-universal.png";
import "./App.css";
import {
  GetContents,
  GetAudio,
  GetDirs,
  ScanForAudio,
} from "../wailsjs/go/dir/Directory";
import {
  LoadMusic,
  GetMetadata,
  GetStatus,
  GetImage,
} from "../wailsjs/go/player/Player";
import Player from "./features/Player";
import { Box, Button, For, Text } from "@chakra-ui/react";
import { usePlayerStore } from "./store";
import { DirTree } from "./components/dir-tree";
import { MusicList } from "./components/music-list";
import { PathBar } from "./components/path-bar";
import { useGeneralStore } from "./store/generalStore";
import { get } from "node:https";
import { useColorMode } from "./components/ui/color-mode";
import { getNeutral } from "./utils";
import { SidebarNavigator } from "./features/sidebar-navigator";

function App() {
  const [resultText, setResultText] = useState(
    "Please enter your name below 👇",
  );
  const [name, setName] = useState("");
  const [dirs, setDirs] = useState<any[]>([]);
  const [audioFiles, setAudioFiles] = useState<string[]>([]);
  const [path, setPath] = useState<string[]>(["/"]);
  const setAudioPath = usePlayerStore((state) => state.setAudioPath);
  const setAll = usePlayerStore((state) => state.setPlayerStatus);
  const setLoaded = usePlayerStore((state) => state.setLoaded);
  const setTrack = usePlayerStore((state) => state.setCurrentTrack);
  const setCurrentTrackImage = usePlayerStore(
    (state) => state.setCurrentTrackImage,
  );

  const { colorMode } = useColorMode();
  const updateName = (e: any) => setName(e.target.value);
  const updateResultText = (result: string) => setResultText(result);

  const scan = () => {
    ScanForAudio("/home/yuri/Data/music").then((res) => {
      console.log(res);
      setAudioFiles(res.data["audio_files"]);
    });
  };

  const getAudios = () => {
    // console.log("getting audios", path.join("/"));
    GetAudio(path.join("/")).then((res) => {
      console.log("getting audios from db", res.data.files);
      setAudioFiles(res.data.files);
    });
  };

  const loadAudio = (item) => {
    LoadMusic(item)
      .then((res) => {
        console.log("loaded loaded loaded", res);
        setLoaded(res.data.loaded);
        GetMetadata().then((res) => {
          setTrack(res.data.metadata);
          console.log("am i here bro showing metadata", res);
        });
        GetImage().then((res) => {
          console.log("image", res);
          setCurrentTrackImage(res.data.image);
        });
        GetStatus().then((res) => {
          console.log("getting status", res);
          setAll(res.data);
        });
        // setAll(JSON.parse(res));
      })
      .catch((error) => {
        console.error("Error loading music:", error);
      });
  };

  const getContent = () => {
    // console.log("joining happens like",["a", "b", "c", "d"])
    GetContents(path.join("/"))
      .then((res) => {
        console.log("result", res);
        // setDirs(res.data.content);
        // setDirs(res.data.dirs);
      })
      .catch((error) => {
        console.error("Error fetching directory contents:", error);
        // setPath((prev) => [...path.]);
      });
  };

  const getDir = () => {
    GetDirs(path.join("/"))
      .then((res) => {
        console.log("result getting die", res);
        setDirs(res.data.dirs);
      })
      .catch((error) => {
        console.error("Error fetching directory contents:", error);
      });
  };

  const setCurrentPath = (dir: string) => {
    GetContents(path.join("/") + "/" + dir)
      .then((res) => {
        setPath((prev) => [...prev, dir]);
      })
      .catch((error) => {
        console.error("Error setting path:", error);
        // setPath((prev) => [...path.]);
      });
  };

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
      <Player />
      <Box flex={1} minH={0}>
        <Box display={"flex"} height={"100%"}>
          <Box
            bg={getNeutral("light", 800)}
            _dark={{ bg: getNeutral("dark", 800) }}
            w={"350px"}
            height={"100%"}
          >
            <SidebarNavigator />
          </Box>
          <Box flex={1} height={"100%"}>
            <MusicList />
          </Box>
          <Box
            bg={getNeutral("light", 800)}
            _dark={{ bg: getNeutral("dark", 800) }}
            minW={"350px"}
            height={"100%"}
          >
            aa
          </Box>
        </Box>
      </Box>
      <Box
        bg={getNeutral("light", 800)}
        _dark={{ bg: getNeutral("dark", 800) }}
        height={"2rem"}
      >
        footer
      </Box>
    </Box>
  );
}

export default App;
