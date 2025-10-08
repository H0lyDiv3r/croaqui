//@ts-nocheck
//
import { useEffect, useState } from "react";
import logo from "./assets/images/logo-universal.png";
import "./App.css";
import { GetContents, GetAudio } from "../wailsjs/go/dir/Directory";
import { LoadMusic } from "../wailsjs/go/player/Player";
import Player from "./features/Player";
import { Box, Button, For, Text } from "@chakra-ui/react";
import { usePlayerStore } from "./store";

function App() {
  const [resultText, setResultText] = useState(
    "Please enter your name below 👇",
  );
  const [name, setName] = useState("");
  const [dirs, setDirs] = useState<string[]>([]);
  const [audioFiles, setAudioFiles] = useState<string[]>([]);
  const [path, setPath] = useState<string[]>(["/"]);
  const setAudioPath = usePlayerStore((state) => state.setAudioPath);
  const updateName = (e: any) => setName(e.target.value);
  const updateResultText = (result: string) => setResultText(result);

  const getAudios = () => {
    GetAudio(path.join("/")).then((res) => {
      console.log(res);
      setAudioFiles(res["audio_files"]);
    });
  };
  const getDir = () => {
    // console.log("joining happens like",["a", "b", "c", "d"])
    GetContents(path.join("/"))
      .then((res) => {
        console.log("result", res);
        setDirs(res.content);
      })
      .catch((error) => {
        console.error("Error fetching directory contents:", error);
        // setPath((prev) => [...path.]);
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
      <Box h={"100%"}>
        {path.join("/")}
        <Button onClick={() => getAudios()}>get audio</Button>
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
                    setCurrentPath(dir);
                  }}
                >
                  {dir}
                </Box>
              )}
            </For>
          </Box>
          <Box bg={"neutral.dark.800"} flexGrow={"1"}>
            <For each={audioFiles}>
              {(item, idx) => (
                <Box key={idx} my={"24px"} onClick={() => setAudioPath(item)}>
                  <Text>{item}</Text>
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
