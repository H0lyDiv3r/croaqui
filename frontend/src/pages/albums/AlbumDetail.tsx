import { getNeutral } from "@/utils";
import { Box } from "@chakra-ui/react";
import { useEffect } from "react";
import { useParams } from "wouter";

export const AlbumDetail = ({ params }: { params: { id: string } }) => {
  // const params = useParams();
  useEffect(() => {
    console.log("here come the params", params);
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
      >
        <Box
          width={"80%"}
          height={"18rem"}
          bg={getNeutral("light", 800)}
          borderRadius={"xl"}
        >
          {" "}
          image
        </Box>
        <Box>"list of songs"</Box>
      </Box>
    </Box>
  );
};
