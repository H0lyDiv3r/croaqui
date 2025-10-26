import { getNeutral } from "@/utils";
import { Box, Card, Image, Text } from "@chakra-ui/react";
import { GetAlbumImage } from "wailsjs/go/media/Media";
import { useLocation } from "wouter";
import { ChakraIcon } from "../ChackraIcon";
import { FaClock, FaMusic } from "react-icons/fa6";
import { useEffect, useState } from "react";

type Item = {
  path: string;
  album: string;
  artist: string;
  duration: number;
  image: string;
  songs: number;
};

export const AlbumCard = ({ item }: { item: Item }) => {
  const [location, navigate] = useLocation();
  const [image, setImage] = useState<string | null>(null);
  const getImage = async (albumName: string) => {
    const res = await GetAlbumImage(albumName);
    console.log("image fetched", res.data.image);
    setImage(res.data.image);
  };
  useEffect(() => {
    getImage(item.album);
  }, []);
  return (
    <Card.Root
      width={"100%"}
      h={"18rem"}
      overflow={"hidden"}
      boxShadow={"0px 0px 12px rgba(0, 0, 0, 0.2)"}
      my={"2"}
      p={2}
      _hover={{ cursor: "pointer" }}
      onClick={() => {
        console.log("routing to", item.album);
        navigate(`/albums/${encodeURIComponent(item.album)}`);
      }}
      borderRadius={"xl"}
      bg={getNeutral("light", 900)}
      _dark={{
        bg: getNeutral("dark", 800),
      }}
    >
      <Card.Body
        p={"0"}
        borderRadius={"lg"}
        overflow={"hidden"}
        bg={getNeutral("light", 600)}
        _dark={{
          bg: getNeutral("dark", 600),
        }}
        pos={"relative"}
      >
        <Image
          src={`data:image/jpeg;base64,${image}`}
          alt={item.album}
          objectFit={"cover"}
          width={"100%"}
          height={"100%"}
          border={"none"}
          onError={(e) => {
            e.currentTarget.style.border = "none";
          }}
        />
        <Box
          pos={"absolute"}
          width={"100%"}
          height={"100%"}
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"space-between"}
          color={"white"}
          textAlign={"center"}
        >
          <Box
            width={"80%"}
            gap={0}
            bg={getNeutral("light", 900)}
            color={getNeutral("light", 200)}
            _dark={{
              color: getNeutral("dark", 100),
              bg: getNeutral("dark", 800),
            }}
            borderBottomRadius={"xl"}
          >
            <Text fontSize={"sm"}>
              {item.album.length > 20
                ? item.album.slice(0, 20) + "..."
                : item.album}
              {/*{item.album}*/}
            </Text>
          </Box>
        </Box>
      </Card.Body>
      <Card.Footer p={2} flexDir={"column"} justifyContent={"start"}>
        <Text fontSize={"sm"}>By {item.artist} </Text>
        <Box
          display={"flex"}
          width={"100%"}
          gap={2}
          mt={2}
          color={getNeutral("light", 200)}
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
      </Card.Footer>
    </Card.Root>
  );
};
