import { Box, Text } from "@chakra-ui/react";
import { Link, useRoute } from "wouter";
import { ChakraIcon } from "../ChackraIcon";
import { LuLibrary } from "react-icons/lu";
import { IoAlbums } from "react-icons/io5";
import { ReactElement, useEffect } from "react";
import { getNeutral } from "@/utils";

export const Navigation = () => {
  return (
    <Box display={"flex"} className="search-bar" gap={"4"}>
      {/*<Link href="/" color={isActive ? "red" : "green"}></Link>*/}
      <ActiveLink href={"/"}>
        <ChakraIcon icon={LuLibrary} boxSize={5} />
      </ActiveLink>
      <ActiveLink href="/albums">
        <ChakraIcon icon={IoAlbums} boxSize={5} />
      </ActiveLink>
      {/*<Link href="/search-results">Artists</Link>*/}
    </Box>
  );
};
const ActiveLink = ({
  href,
  children,
}: {
  href: string;
  children: ReactElement;
}) => {
  const [isActive] = useRoute(href);
  return (
    <Link href={href}>
      <Box
        color={isActive ? "brand.500" : getNeutral("light", 400)}
        _dark={{
          color: isActive ? "brand.300" : getNeutral("dark", 400),
        }}
      >
        {children}
      </Box>
    </Link>
  );
};
