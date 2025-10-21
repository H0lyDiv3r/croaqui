import { ChakraIcon } from "@/components/ChackraIcon";
import { getNeutral } from "@/utils";
import { getAlbums } from "@/utils/data/audioData";
import {
  Box,
  Grid,
  Image,
  Text,
  VStack,
  Heading,
  IconButton,
  Card,
  SimpleGrid,
  Span,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaClock, FaMusic, FaRecordVinyl, FaTimeline } from "react-icons/fa6";
import { useLocation } from "wouter";

export const Albums = () => {
  const [albums, setAlbums] = useState<any[]>([]);
  const [location, navigate] = useLocation();
  const [counts, setCounts] = useState<{ artists: number; albums: number }>({
    artists: 0,
    albums: 0,
  });
  useEffect(() => {
    async function fetchAlbums() {
      const fetchedAlbums = await getAlbums();
      setAlbums(fetchedAlbums.albums);
      setCounts({
        artists: fetchedAlbums.counts.artists,
        albums: fetchedAlbums.counts.albums,
      });
    }
    fetchAlbums();
  }, []);
  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      flex={1}
      p={6}
      overflowY="auto"
    >
      <Box
        display={"flex"}
        flexDir={"column"}
        width={"80%"}
        justifyContent={"start"}
        textAlign={"left"}
      >
        <Box width={"100%"}>
          <Text fontSize={"2xl"} fontWeight={"bold"} fontFamily={"rubik"}>
            YOUR ALBUMS
          </Text>
          <Text
            color={getNeutral("light", 300)}
            _dark={{ color: getNeutral("dark", 300) }}
            fontSize={"md"}
          >
            {counts.albums} albums from {counts.artists} artists
          </Text>
        </Box>
        <Box width={"100%"}>
          <SimpleGrid minChildWidth={"14rem"} gap={2}>
            {albums &&
              albums.map((item, idx) => {
                return (
                  <Card.Root
                    maxWidth={"16rem"}
                    key={idx}
                    width={"100%"}
                    h={"18rem"}
                    overflow={"hidden"}
                    boxShadow={"0px 0px 12px rgba(0, 0, 0, 0.2)"}
                    my={"2"}
                    onClick={() => {
                      console.log("routing to", item.album);
                      navigate(`/albums/${item.album}`);
                    }}
                    borderRadius={"lg"}
                  >
                    <Card.Body p={"0"} transform="translateZ(0)">
                      <Image
                        src={`data:image/jpeg;base64,${item.image}`}
                        alt={item.album}
                        objectFit={"cover"}
                        width={"100%"}
                        height={"100%"}
                        onError={(e) => {
                          e.currentTarget.style.display = "none"; // hides the broken image entirely
                        }}
                        // filter={"blur(1px)"}
                      />
                      <Image
                        pos={"absolute"}
                        bg={"red"}
                        height={"100%"}
                        width={"100%"}
                        objectFit={"cover"}
                        filter={"blur(8px) "}
                        // _dark={{
                        //   filter: "blur(10px) brightness(0)",
                        // }}
                        onError={(e) => {
                          e.currentTarget.style.display = "none"; // hides the broken image entirely
                        }}
                        src={`data:image/jpeg;base64,${item.image}`}
                        css={{
                          maskImage:
                            "linear-gradient(to bottom, transparent 10%, transparent 100%)",
                          WebkitMaskImage:
                            "linear-gradient(to bottom,rgba(0, 0, 0, 0) 40%, black 70% )",
                        }}
                      />

                      {/*
                      <Box
                        width={"100%"}
                        pos={"absolute"}
                        top={"0"}
                        left={"0"}
                        display={"flex"}
                        flexDirection={"column"}
                        p={2}
                        color={getNeutral("light", 900)}
                        fontSize={"sm"}
                      >
                        <Box
                          display={"flex"}
                          justifyContent={"space-between"}
                          gap={2}
                        >
                          <Text
                            bg={"brand.500"}
                            color={"brand.100"}
                            p={"2px"}
                            borderRadius={"sm"}
                          >
                            {item.songs} Songs{" "}
                          </Text>
                          <Text
                            color={"brand.200"}
                            bg={"rgba(0, 0, 0, 0.4)"}
                            p={"2px"}
                          >
                            {Math.floor(item.duration / 3600)
                              .toString()
                              .padStart(2, "0")}
                            :
                            {(Math.floor(item.duration / 60) % 60)
                              .toString()
                              .padStart(2, "0")}
                            :
                            {Math.floor(item.duration % 60)
                              .toString()
                              .padStart(2, "0")}
                          </Text>
                        </Box>
                      </Box>*/}
                      <Box
                        width={"100%"}
                        height={"100%"}
                        pos={"absolute"}
                        bottom={"0"}
                        left={"0"}
                        display={"flex"}
                        flexDirection={"column"}
                        justifyContent={"end"}
                        p={2}
                        color={getNeutral("light", 900)}
                        fontSize={"sm"}
                        bg={
                          "linear-gradient(to bottom, rgba(0,0,0,0)20%, rgba(0,0,0,0.4)70%)"
                        }
                        _dark={{
                          color: getNeutral("dark", 200),
                        }}
                        fontWeight={500}
                      >
                        <Box>
                          <Text
                            fontSize={"md"}
                            _dark={{
                              color: getNeutral("dark", 100),
                            }}
                          >
                            {item.album.length > 20
                              ? item.album.slice(0, 20) + "..."
                              : item.album}
                          </Text>
                          <Text>By {item.artist} </Text>
                        </Box>
                        <Box
                          display={"flex"}
                          gap={2}
                          mt={2}
                          color={getNeutral("light", 800)}
                          _dark={{ color: getNeutral("dark", 300) }}
                        >
                          <Box display={"flex"} gap={1} alignItems={"center"}>
                            <ChakraIcon icon={FaMusic} boxSize={4} />
                            <Text>{item.songs}</Text>
                          </Box>
                          <Box display={"flex"} gap={1} alignItems={"center"}>
                            <ChakraIcon icon={FaClock} boxSize={4} />

                            <Text p={"2px"}>
                              {Math.floor(item.duration / 3600)
                                .toString()
                                .padStart(2, "0")}
                              :
                              {(Math.floor(item.duration / 60) % 60)
                                .toString()
                                .padStart(2, "0")}
                              :
                              {Math.floor(item.duration % 60)
                                .toString()
                                .padStart(2, "0")}
                            </Text>
                          </Box>
                        </Box>
                      </Box>

                      {/*<Text>{item.album}</Text>*/}
                    </Card.Body>
                  </Card.Root>
                );
              })}
          </SimpleGrid>
        </Box>
      </Box>
    </Box>
  );
};
