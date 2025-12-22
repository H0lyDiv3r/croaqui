import {
  Box,
  createTreeCollection,
  For,
  Text,
  TreeView,
} from "@chakra-ui/react";
import { GetDirs } from "../../../wailsjs/go/media/Media";
import { useEffect } from "react";
import { ChakraIcon } from "../ChackraIcon";
import { FaFolder } from "react-icons/fa6";
import { getNeutral, handleRemoveDir } from "@/utils";
import { QueryParams, useDataStore } from "@/store";
import { getAudio } from "@/utils/data/audioData";
import { Empty } from "../empty";
import { useLocation } from "wouter";
import { BsFillTrashFill } from "react-icons/bs";

export const DirTree = () => {
  const dirs = useDataStore((state) => state.dirs);
  const setDirs = useDataStore((state) => state.setDirs);
  const currentPath = useDataStore((state) => state.currentPath);
  const setCurrentPath = useDataStore((state) => state.setCurrentPath);
  const setMusicListPath = useDataStore((state) => state.setMusicListPath);
  const setAudioFiles = useDataStore((state) => state.setMusicFiles);
  const [_, setLocation] = useLocation();
  const getDir = () => {
    GetDirs(currentPath)
      .then((res) => {
        setDirs(res.data.dirs);
      })
      .catch((error) => {
        console.error("Error fetching directory contents:", error);
      });
  };

  const getAudioFiles = (params: Partial<QueryParams> | null) => {
    getAudio({ ...params, page: 0, hasMore: true })
      .then((res) => {
        setAudioFiles(res);
      })
      .catch((error) => {
        console.error("Error fetching audio contents:", error);
      });
  };

  useEffect(() => {
    getDir();
  }, [currentPath]);

  return (
    <Box
      textAlign={"left"}
      textWrap={"nowrap"}
      whiteSpace={"nowrap"}
      color={getNeutral("light", 200)}
      _dark={{ color: getNeutral("dark", 200) }}
    >
      <>
        {dirs && dirs.length > 0 ? (
          dirs.map(
            (dir: { id: string; name: string; path: string }): JSX.Element => (
              <Box
                borderRadius={"sm"}
                overflow={"hidden"}
                _hover={{
                  "& [data-hover-target]": {
                    opacity: 1,
                    pointerEvents: "auto",
                  },
                  bg: getNeutral("light", 700),
                  cursor: "pointer",
                  _dark: {
                    bg: getNeutral("dark", 700),
                  },
                }}
                key={dir.id}
                onClick={() => {
                  setLocation("/");
                  getAudioFiles({ path: dir.path });
                  GetDirs(dir.path).then((res) => {
                    if (res.data.dirs) {
                      // console.log("showing audio in path fromhere", dir.path);
                      // getAudioFiles({
                      //   path: "/home/yuri/Data/music/Supertramp/",
                      // });
                      setCurrentPath(dir.path);
                    } else {
                      console.log("showing audio in path or here", dir.path);
                    }
                    setMusicListPath(dir.path);
                  });
                }}
              >
                <Box display={"flex"} justifyContent={"space-between"} p={3}>
                  <Box display={"flex"} alignItems={"center"} gap={"2"}>
                    <ChakraIcon icon={FaFolder}></ChakraIcon>
                    <Text overflow={"hidden"}>{dir.name.slice(0, 20)}</Text>
                  </Box>
                  <Box
                    data-hover-target
                    as="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("delete dir", dir.path);
                      handleRemoveDir(dir.path);
                      // handleDeletePlaylist(Number(playlist.id));
                    }}
                    opacity={0}
                    pointerEvents="none"
                    _hover={{
                      cursor: "pointer",
                    }}
                    borderRadius={"sm"}
                  >
                    <ChakraIcon
                      icon={BsFillTrashFill}
                      _hover={{ opacity: 0.5 }}
                    />
                  </Box>
                </Box>
              </Box>
            ),
          )
        ) : (
          <Empty.Directory />
        )}
      </>
    </Box>
  );
};
