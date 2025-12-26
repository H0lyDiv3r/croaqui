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
import { ChakraIcon } from "@/components/ChackraIcon";
import { BsArrowLeft } from "react-icons/bs";
import { Link, useLocation } from "wouter";

export const AlbumDetail = ({ params }: { params: { id: string } }) => {
  // const params = useParams();
  const [, setLocation] = useLocation();
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
    <Box
      display={"flex"}
      flexDir={"column"}
      flex={1}
      p={6}
      overflowY="auto"
      gap={3}
    >
      <Box textAlign={"left"}>
        <Link href={"/"}>
          <ChakraIcon
            icon={BsArrowLeft}
            color={getNeutral("light", 400)}
            _dark={{ color: getNeutral("dark", 400) }}
            boxSize={5}
            _hover={{
              color: getNeutral("light", 500),
              _dark: { color: getNeutral("dark", 500) },
            }}
          />
        </Link>
      </Box>
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
              whiteSpace="normal"
              overflowWrap="break-word"
              wordBreak={"break-all"}
              color={complementColor}
            >
              <Text
                fontSize="5rem"
                fontFamily="sans-serif"
                fontStyle={"italic"}
                fontWeight={700}
                lineHeight={1}
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
          <MusicList handleGetQueue={handleGetQueue} />
        </Box>
      </Box>
    </Box>
  );
};
