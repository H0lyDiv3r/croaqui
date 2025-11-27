import { Box, Text } from "@chakra-ui/react";
import { Link } from "wouter";

export const Navigation = () => {
  return (
    <Box display={"flex"} className="search-bar" gap={"4"}>
      <Link href="/">Library</Link>
      <Link href="/albums">Albums</Link>
      <Link href="/search-results">Artists</Link>
    </Box>
  );
};
