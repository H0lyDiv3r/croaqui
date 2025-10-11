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

  useEffect(() => {
    getDir();
  }, [path]);

  return (
    <Box bg={"neutral.dark.900"} h={"100%"} id="App">
      <Player />
      <Button onClick={() => GetImage()}>get image</Button>
      <Box h={"100%"}>
        {path.join("/")}
        <Button onClick={() => getAudios()}>get audio</Button>

        <Button onClick={() => scan()}>scan audio</Button>
        <Box display={"flex"} h={"100%"}>
          <Box
            width={"200px"}
            overflow={"hidden"}
            textAlign={"left"}
            textWrap={"nowrap"}
          >
            <Button onClick={() => getDir()}>getdir</Button>
            <For each={dirs}>
              {(dir, idx) => (
                <Box
                  key={idx}
                  my={"24px"}
                  onClick={() => {
                    // setCurrentPath(dir.path);
                    setPath(dir.path.split("/"));
                    console.log("i am here bro im here", dir);
                  }}
                >
                  {dir.name}
                </Box>
              )}
            </For>
          </Box>
          <Box bg={"neutral.dark.800"} flexGrow={"1"}>
            <For each={audioFiles}>
              {(item, idx) => (
                <Box key={idx} my={"24px"} onClick={() => loadAudio(item.path)}>
                  <Text>{item.title}</Text>
                </Box>
              )}
            </For>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
