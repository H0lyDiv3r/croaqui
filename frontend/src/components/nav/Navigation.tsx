import { Box, Text } from "@chakra-ui/react";
import { Link } from "wouter";

export const Navigation = () => {
  return (
    <Box display={"flex"} className="search-bar" gap={"4"}>
      <Text>Home</Text>
      <Link href="/library">Library</Link>
      <Link href="/albums">Albums</Link>
      {/*<Text>Home</Text>
      <Text>Albums</Text>*/}
      <Text>Artists</Text>
    </Box>
  );
};
