import { Box } from "@chakra-ui/react";

export const Albums = () => {
  return (
    <Box display={"flex"} height={"100%"}>
      <Box
        // bg={getNeutral("light", 800)}
        // _dark={{ bg: getNeutral("dark", 800) }}
        w={"350px"}
        height={"100%"}
      ></Box>
      <Box flex={1} height={"100%"}>
        list of albums
      </Box>
      <Box minW={"350px"} height={"100%"}>
        aa
      </Box>
    </Box>
  );
};
