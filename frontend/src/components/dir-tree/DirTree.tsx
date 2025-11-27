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
import { getNeutral } from "@/utils";
import { QueryParams, useDataStore } from "@/store";
import { getAudio } from "@/utils/data/audioData";
import { Empty } from "../empty";
import { useLocation } from "wouter";

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
                  bg: getNeutral("light", 700),
                  cursor: "pointer",
                  _dark: {
                    bg: getNeutral("dark", 700),
                  },
                }}
                key={dir.id}
                onClick={() => {
                  setLocation("/");
                  GetDirs(dir.path).then((res) => {
                    if (res.data.dirs) {
                      setCurrentPath(dir.path);
                    } else {
                      getAudioFiles({ path: dir.path });
                    }
                    setMusicListPath(dir.path);
                  });
                }}
              >
                <Box display={"flex"} alignItems={"center"} gap={"2"} p={3}>
                  <ChakraIcon icon={FaFolder}></ChakraIcon>
                  <Text overflow={"hidden"}>{dir.name}</Text>
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
