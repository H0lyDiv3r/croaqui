import { Box, Dialog, SimpleGrid, Text } from "@chakra-ui/react";
import { PathBar } from "../path-bar";
import { useEffect, useState } from "react";
import {
  getDirContents,
  getNeutral,
  getStandardDirs,
  handleScan,
} from "@/utils";
import { ChakraIcon } from "../ChackraIcon";
import { FaFolder } from "react-icons/fa6";
import { useNavigatorStore } from "@/store/navigatorStore";
import { GetContents } from "wailsjs/go/media/Media";
import { Empty } from "../empty";
import { DefaultButton } from "../buttons";

const DialogOverlay: any = Dialog.Backdrop;
const DialogContent: any = Dialog.Content;
const DialogPositioner: any = Dialog.Positioner;
const DialogBody: any = Dialog.Body;
const DirScanner = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) => {
  const [dirs, setDirs] = useState([]);
  const navPath = useNavigatorStore((state) => state.navPath);
  const setNavPath = useNavigatorStore((state) => state.setNavPath);
  const dirList = useNavigatorStore((state) => state.dirList);
  const setDirList = useNavigatorStore((state) => state.setDirList);
  const setToBeScanned = useNavigatorStore((state) => state.setToBeScanned);
  const toBeScanned = useNavigatorStore((state) => state.toBeScanned);
  useEffect(() => {
    const fetchDir = async () => {
      const data = await getStandardDirs();
      setDirs(data);
    };

    fetchDir();
  }, []);

  useEffect(() => {
    const fetchDir = async () => {
      const data = await getDirContents(navPath === "" ? "/" : navPath);
      setDirList(data.content);
    };

    fetchDir();
  }, [navPath]);

  return (
    <Box>
      <Dialog.Root open={open} placement={"center"}>
        <DialogOverlay />
        <DialogPositioner
          p={0}
          onClick={(e: Event) => {
            e.stopPropagation();
            setOpen(false);
          }}
        >
          <DialogContent
            w={{ base: "768px", md: "1024px", lg: "1280px" }}
            h="80%"
            maxW="100%" // ensure it doesn’t overflow container
            mx="auto"
            overflow={"hidden"}
            m={0}
          >
            <DialogBody
              display="flex"
              flexDirection="column"
              p={2}
              overflow={"hidden"}
              gap={2}
              onClick={(e: Event) => {
                e.stopPropagation();
              }}
              bg={getNeutral("light", 800)}
              _dark={{
                bg: getNeutral("dark", 800),
              }}
            >
              <Box display={"flex"} gap={2}>
                <Box flex={1}>
                  <PathBar currentPath={navPath} setCurrentPath={setNavPath} />
                </Box>
                <Box>
                  <DefaultButton
                    action={(e: Event) => {
                      e.stopPropagation();
                      handleScan(toBeScanned);
                    }}
                    disabled={!toBeScanned}
                  >
                    scan
                  </DefaultButton>
                </Box>
              </Box>
              <Box flex={"1"} display={"flex"} gap={2} minH={0}>
                <Box
                  minW={{ base: "200px" }}
                  bg={getNeutral("light", 900)}
                  _dark={{
                    bg: getNeutral("dark", 900),
                  }}
                  borderRadius={"lg"}
                  p={1}
                  textAlign={"left"}
                >
                  {dirs &&
                    dirs.length > 0 &&
                    dirs.map((dir: any) => {
                      return (
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
                          key={dir.path}
                          bg={
                            navPath === dir.path
                              ? getNeutral("light", 700)
                              : getNeutral("light", 900)
                          }
                          _dark={{
                            bg:
                              navPath === dir.path
                                ? getNeutral("dark", 700)
                                : getNeutral("dark", 900),
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setNavPath(dir.path);
                          }}
                        >
                          <Box
                            display={"flex"}
                            alignItems={"center"}
                            gap={"2"}
                            p={2}
                          >
                            <ChakraIcon icon={FaFolder}></ChakraIcon>
                            <Text overflow={"hidden"}>{dir.name}</Text>
                          </Box>
                        </Box>
                      );
                    })}
                </Box>
                <Box
                  bg={getNeutral("light", 900)}
                  _dark={{
                    bg: getNeutral("dark", 900),
                  }}
                  flex={1}
                  borderRadius={"lg"}
                  p={2}
                  overflowY={"auto"}
                >
                  <SimpleGrid minChildWidth={"9rem"} gap={2}>
                    {dirList && dirList.length > 0 ? (
                      dirList.map((dir: string, idx: number) => (
                        <Box w={"9rem"} key={idx}>
                          <Box
                            width={"9rem"}
                            height={"9rem"}
                            borderRadius={"lg"}
                            _hover={{
                              cursor: "pointer",
                              bg: getNeutral("light", 800),
                              _dark: {
                                bg: getNeutral("dark", 800),
                              },
                            }}
                            display={"flex"}
                            alignItems={"center"}
                            justifyContent={"center"}
                            gap={"2"}
                            p={2}
                            bg={
                              toBeScanned === navPath + "/" + dir
                                ? getNeutral("light", 800)
                                : getNeutral("light", 900)
                            }
                            _dark={{
                              bg:
                                toBeScanned === navPath + "/" + dir
                                  ? getNeutral("dark", 800)
                                  : getNeutral("dark", 900),
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setToBeScanned(navPath + "/" + dir);
                            }}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              setNavPath(navPath + "/" + dir);
                              setToBeScanned(navPath + "/" + dir);
                            }}
                          >
                            <Box>
                              <ChakraIcon
                                icon={FaFolder}
                                boxSize={9}
                              ></ChakraIcon>
                              <Text overflow={"hidden"}>{dir}</Text>
                            </Box>
                          </Box>
                        </Box>
                      ))
                    ) : (
                      <Empty.Directory />
                    )}
                  </SimpleGrid>
                </Box>
              </Box>
              <Box>c</Box>
            </DialogBody>
          </DialogContent>
        </DialogPositioner>
      </Dialog.Root>
    </Box>
  );
};

export default DirScanner;
