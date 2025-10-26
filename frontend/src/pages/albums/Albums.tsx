import { AlbumCard } from "@/components/cards";
import { useDataStore, useQueryStore } from "@/store";
import { getAlbums, getNeutral } from "@/utils";
import { Box, Text, SimpleGrid } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

export const Albums = () => {
  const [albums, setAlbums] = useState<any[]>([]);
  const [counts, setCounts] = useState<{ artists: number; albums: number }>({
    artists: 0,
    albums: 0,
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = async () => {
    const current = scrollRef.current;
    if (!current) return;
    if (current.scrollTop + current.clientHeight >= current.scrollHeight) {
      // getAudios(currentPath);
      const newPage = await getAlbums({
        page: useQueryStore.getState().page + 1,
      });
      useQueryStore.setState((state) => ({
        ...state,
        page: state.hasMore ? state.page + 1 : state.page,
      }));
      if (!newPage) {
        return;
      }
      console.log("she way out", newPage);
      setAlbums((prevAlbums) => [...prevAlbums, ...newPage.albums]);
      // useDataStore.setState((state) => ({
      //   ...state,
      //   musicFiles: [...state.musicFiles, ...newPage],
      // }));
    }
  };
  useEffect(() => {
    async function fetchAlbums() {
      useQueryStore.getState().clearQuery();
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
        <Box
          width={"100%"}
          overflow={"auto"}
          mt={"4"}
          ref={scrollRef}
          onScroll={handleScroll}
        >
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
