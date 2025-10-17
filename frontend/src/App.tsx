import "./App.css";
import Player from "./features/Player";
import { Box, Button, Image, Text } from "@chakra-ui/react";
import { MusicList } from "./components/music-list";
import { getNeutral } from "./utils";
import { SidebarNavigator } from "./features/sidebar-navigator";
import { GetAlbums, GetAlbumsWithRoutines } from "../wailsjs/go/media/Media";
import { useState } from "react";

function App() {
  const [albums, setAlbums] = useState<any>([]);
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
      <Box h={"5rem"}>aa</Box>
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
      <Player />
    </Box>
  );
}

export default App;
