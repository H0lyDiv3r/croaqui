import {
  Box,
  createTreeCollection,
  For,
  Text,
  TreeView,
} from "@chakra-ui/react";
import { GetAudio, GetDirs } from "../../../wailsjs/go/dir/Directory";
import { useNavigationStore } from "@/store";
import { useEffect } from "react";
import { ChakraIcon } from "../ChackraIcon";
import { FaFolder } from "react-icons/fa6";
import { getNeutral } from "@/utils";

export const DirTree = () => {
  const dirs = useNavigationStore((state) => state.dirs);
  const setDirs = useNavigationStore((state) => state.setDirs);
  const currentPath = useNavigationStore((state) => state.currentPath);
  const setCurrentPath = useNavigationStore((state) => state.setCurrentPath);
  const setMusicFiles = useNavigationStore((state) => state.setMusicFiles);
  const getDir = () => {
    GetDirs(currentPath)
      .then((res) => {
        console.log("result getting die", res);
        setDirs(res.data.dirs);
      })
      .catch((error) => {
        console.error("Error fetching directory contents:", error);
      });
  };
  const getAudios = (path: string) => {
    // console.log("getting audios", path.join("/"));
    GetAudio(path).then((res) => {
      console.log("getting audios from db", res.data.files);
      setMusicFiles(res.data.files);
    });
  };

  useEffect(() => {
    getDir();
    getAudios(currentPath);
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
        {dirs.map(
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
                GetDirs(dir.path).then((res) => {
                  if (res.data.dirs) {
                    setCurrentPath(dir.path);
                  }
                });
                getAudios(dir.path);
              }}
            >
              <Box display={"flex"} alignItems={"center"} gap={"2"} m={"2"}>
                <ChakraIcon icon={FaFolder}></ChakraIcon>
                <Text overflow={"hidden"}>{dir.name}</Text>
              </Box>
            </Box>
          ),
        )}
      </>
    </Box>
  );
};
