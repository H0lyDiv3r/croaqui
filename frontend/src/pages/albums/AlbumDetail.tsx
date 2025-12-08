import {
  getAlbumData,
  getComplementaryColor,
  getNeutral,
  getQueue,
  toHMS,
} from "@/utils";
import { Box, Image, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDataStore, usePlayerStore, useQueueStore } from "@/store";
import { getAudio } from "@/utils/data/audioData";
import { GetAlbumImage } from "../../../wailsjs/go/media/Media";
import analyze from "rgbaster";
import { MusicList } from "@/components/music-list";

export const AlbumDetail = ({ params }: { params: { id: string } }) => {
  // const params = useParams();

  const [banner, setBanner] = useState("");
  const [dominantColor, setDominantColor] = useState("");
  const [complementColor, setComplementColor] = useState("");
  const [albumInfo, setAlbumInfo] = useState({
    album: "",
    artist: "",
    duration: "",
    songs: "",
  });
  const audioFiles = useDataStore((state) => state.musicFiles);
  const shuffle = useQueueStore((state) => state.shuffle);
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
    //
    console.log("these are the audio files", audioFiles);
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

  const handleGetQueue = async () => {
    return await getQueue({
      type: "album",
      args: String(decodeURIComponent(params.id) || 0),

      shuffle: shuffle,
    });
  };
  //
  const getDominantColor = async (img: string) => {
    const colors = await analyze(`${img}`);
    console.log(
      "colors go brr",
      colors ? colors[0].color : "rgba(255,255,255,1)",
    );
    return colors ? colors[0].color : "rgba(255,255,255,1)";
  };
  const getBanner = async () => {
    const banner = await GetAlbumImage(decodeURIComponent(params.id));
    return banner.data.image;
  };

  useEffect(() => {
    const fetchData = async () => {
      await getAudioFiles();
      await getAlbumInfo();
      const img = await getBanner();
      setBanner(img);
      return img;
    };

    fetchData();
  }, []);

  useEffect(() => {
    const getColors = async () => {
      const dominant = await getDominantColor(banner);
      setComplementColor(() => getComplementaryColor(dominant));
      setDominantColor(() => dominant);
    };

    if (banner) {
      getColors();
    }
  }, [banner]);
  return (
    <Box display={"flex"} flex={1} p={6} overflowY="auto">
      <Box
        display={"flex"}
        flexDir={"column"}
        alignItems={"center"}
        flex={1}
        gap={8}
      >
        <Box
          pos={"relative"}
          bg={getNeutral("light", 800)}
          borderTopRadius={"xl"}
          overflow={"hidden"}
          width={"100%"}
        >
          <Box
            h={"100%"}
            w={"100%"}
            textAlign={"left"}
            bg={dominantColor}
            display={"flex"}
            alignItems={"center"}
            p={6}
            gap={5}
          >
            <Box
              width={"16rem"}
              height={"16rem"}
              border={"1px solid"}
              borderColor={complementColor}
              borderRadius={"lg"}
              overflow={"hidden"}
              zIndex={2}
            >
              <Image
                src={`${banner}`}
                alt="Album Cover"
                height="100%"
                width={"100%"}
                objectFit="cover"
                objectPosition={"center"}
              />
            </Box>

            <Box
              pos="absolute"
              top={0}
              left={0}
              width="100%"
              height="100%"
              zIndex={1}
              opacity={0.1}
              whiteSpace="normal" // allow wrapping
              overflowWrap="break-word" // break mid-word if necessary
              wordBreak={"break-all"}
              color={complementColor}
            >
              <Text
                fontSize="5rem"
                fontFamily="sans-serif"
                fontStyle={"italic"}
                fontWeight={700}
                lineHeight={1} // optional: reduce spacing between lines
              >
                {(albumInfo.artist + " ").repeat(100)}
              </Text>
            </Box>

            <Box
              display={"flex"}
              flexDir={"column"}
              justifyContent={"space-between"}
              height={"90%"}
              width={"100%"}
              color={complementColor}
              zIndex={2}
              fontFamily={"sans-serif"}
            >
              <Box>
                <Text fontSize="3xl" fontWeight={"bolder"} lineHeight="short">
                  {albumInfo.album}
                </Text>

                <Text fontSize="2xl" fontWeight="semibold" opacity={0.8}>
                  By {albumInfo.artist}
                </Text>
              </Box>
              <Box>
                <Text fontSize="2xl" fontWeight={"semibold"} opacity={0.8}>
                  {albumInfo.songs} Songs
                </Text>
                <Text fontSize="xl" fontWeight={"medium"}>
                  {toHMS(Number(albumInfo.duration))}
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box flex={1} minH={0} width={"100%"} overflow={"auto"}>
          {/*{audioFiles.map((item, idx) => (
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
          ))}*/}
          <MusicList handleGetQueue={handleGetQueue} />
        </Box>
      </Box>
    </Box>
  );
};
