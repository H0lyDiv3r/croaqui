import { AlbumCard } from "@/components/cards";
import { getNeutral } from "@/utils";
import { getAlbums } from "@/utils/data/audioData";
import { Box, Text, SimpleGrid } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export const Albums = () => {
  const [albums, setAlbums] = useState<any[]>([]);
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
                return <AlbumCard key={idx} item={item} />;
              })}
          </SimpleGrid>
        </Box>
      </Box>
    </Box>
  );
};
