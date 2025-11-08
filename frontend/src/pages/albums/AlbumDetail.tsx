import { getAlbumData, getNeutral, getQueue, toHMS } from "@/utils";
import { Box, Grid, GridItem, Image, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  GetImage,
  GetStatus,
  LoadMusic,
} from "../../../wailsjs/go/player/Player";
import { useDataStore, usePlayerStore } from "@/store";
import { getAudio } from "@/utils/data/audioData";
import { GetAlbumImage } from "../../../wailsjs/go/media/Media";
// import { useParams } from "wouter";

export const AlbumDetail = ({ params }: { params: { id: string } }) => {
  // const params = useParams();

  const [banner, setBanner] = useState("");
  const [albumInfo, setAlbumInfo] = useState({
    album: "",
    artist: "",
    duration: "",
    songs: "",
  });
  const audioFiles = useDataStore((state) => state.musicFiles);
  const setAll = usePlayerStore((state) => state.setPlayerStatus);
  const setLoaded = usePlayerStore((state) => state.setLoaded);
  const setTrack = usePlayerStore((state) => state.setCurrentTrack);
  const currentPath = useDataStore((state) => state.currentPath);
  const setCurrentTrackImage = usePlayerStore(
    (state) => state.setCurrentTrackImage,
  );

  const getAudioFiles = async () => {
    const audioFiles = await getAudio({
      album: decodeURIComponent(params.id),
      hasMore: true,
      page: 0,
      limit: 0,
    });
    // setAll(audioFiles);
    useDataStore.setState((state) => ({
      ...state,
      musicFiles: [...audioFiles],
    }));
  };

  const getAlbumInfo = async () => {
    const res = await getAlbumData(decodeURIComponent(params.id));
    if (!res) {
      console.error("Album not found");
      return;
    }
    setAlbumInfo(res.albumInfo);
    // setAll(audioFiles);
  };
  const loadAudio = (item: any) => {
    // LoadMusic(item.path)
    //   .then((res) => {
    //     setLoaded(res.data.loaded);
    //     setTrack(item);
    //     GetImage().then((res) => {
    //       setCurrentTrackImage(res.data.image);
    //     });
    //     GetStatus().then((res) => {
    //       setAll(res.data);
    //     });
    //     // setAll(JSON.parse(res));
    //   })
    //   .catch((error) => {
    //     console.error("Error loading music:", error);
    //   });
  };
  // const handleGetQueue = async () => {
  //   return await getQueue({
  //     type: "album",
  //     args: String(currentPlaylist || 0),
  //     shuffle: shuffle,
  //   });
  // };
  const getBanner = async () => {
    const banner = await GetAlbumImage(decodeURIComponent(params.id));
    return banner.data.image;
  };

  useEffect(() => {
    const fetchData = async function fetchData() {
      await getAudioFiles();
      await getAlbumInfo();
      setBanner(await getBanner());
    };
    fetchData();
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
        alignItems={"center"}
        width={"80%"}
        gap={8}
      >
        <Box
          pos={"relative"}
          width={"80%"}
          height={"18rem"}
          bg={getNeutral("light", 800)}
          borderRadius={"xl"}
          overflow={"hidden"}
        >
          <Image
            src={`data:image/jpeg;base64,${banner}`}
            alt="Album Cover"
            width="100%"
            height="100%"
            objectFit="cover"
            objectPosition={"center"}
            // onError={(e) => {
            //   e.currentTarget.style.display = "none"; // hides the broken image entirely
            // }}
          />
          <Box
            pos={"absolute"}
            top={"0"}
            left={"0"}
            h={"100%"}
            w={"100%"}
            bg={"rgba(0,0,0,0.6)"}
            p={"6"}
            textAlign={"left"}
          >
            <Box
              display={"flex"}
              flexDir={"column"}
              justifyContent={"space-between"}
              height={"100%"}
              color={getNeutral("light", 700)}
            >
              <Box>
                <Text fontSize="2xl" fontWeight="600" lineHeight="short">
                  {albumInfo.album}
                </Text>

                <Text
                  fontSize="xl"
                  fontWeight="medium"
                  color={getNeutral("light", 600)}
                >
                  By {albumInfo.artist}
                </Text>
              </Box>
              <Box>
                <Text fontSize="lg">{albumInfo.songs} Songs</Text>
                <Text fontSize="md" color={getNeutral("light", 600)}>
                  {toHMS(Number(albumInfo.duration))}
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box flex={1} minH={0} overflow={"auto"} width={"80%"}>
          {audioFiles.map((item, idx) => (
            <Grid
              alignItems={"center"}
              templateColumns="repeat(24, 1fr)"
              fontSize={"sm"}
              whiteSpace={"nowrap"}
              gap={4}
              p={"2"}
              key={item.id}
              // bg={idx % 2 === 0 ? getNeutral("light", 800) : "none"}
              color={getNeutral("light", 200)}
              _dark={{
                // bg: idx % 2 === 0 ? getNeutral("dark", 800) : "none",
                color: getNeutral("dark", 200),
              }}
              _hover={{
                bg: getNeutral("light", 700),
                cursor: "pointer",
                _dark: {
                  bg: getNeutral("dark", 700),
                },
              }}
              onClick={() => {
                loadAudio(item);
              }}
              textAlign={"left"}
            >
              <GridItem colSpan={1} overflow={"hidden"}>
                {idx + 1}
              </GridItem>
              <GridItem colSpan={8} overflow={"hidden"} textAlign={"left"}>
                <Text whiteSpace={"nowrap"}>{item.title}</Text>
                <Text
                  whiteSpace={"nowrap"}
                  fontSize={"xs"}
                  color={getNeutral("light", 400)}
                  _dark={{
                    color: getNeutral("dark", 400),
                  }}
                >
                  {item.artist}
                </Text>
              </GridItem>

              <GridItem colSpan={6} overflow={"hidden"}>
                {item.album ? item.album : "-"}
              </GridItem>
              <GridItem colSpan={6} overflow={"hidden"}>
                {item.genre ? item.genre : "-"}
              </GridItem>
              <GridItem colSpan={2} overflow={"hidden"}>
                {toHMS(item.duration)}
              </GridItem>
              <GridItem colSpan={1} overflow={"hidden"}>
                ...
              </GridItem>
            </Grid>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
