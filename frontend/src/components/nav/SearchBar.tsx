import { Box, Input, InputGroup, Text } from "@chakra-ui/react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { ChakraIcon } from "../ChackraIcon";
import { getBrandWithAlpha, getNeutral } from "@/utils";
import { useRef, useState } from "react";
import { handleSearch } from "@/utils/action";
import { useDataStore, useQueryStore } from "@/store";
import { IoAlbums } from "react-icons/io5";
import { BiText, BiUser } from "react-icons/bi";
import { PiPath } from "react-icons/pi";
import { BsMusicNote } from "react-icons/bs";
import { useLocation } from "wouter";

export const SearchBar = () => {
  const [focused, setFocused] = useState(false);
  const [_, setLocation] = useLocation();
  const setAudioFiles = useDataStore((state) => state.setMusicFiles);
  const searchRef = useRef<HTMLInputElement>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const phrase = useQueryStore((state) => state.search);
  const filters = [
    { name: "album", icon: IoAlbums },
    { name: "artist", icon: BiUser },
    { name: "title", icon: BiText },
    { name: "path", icon: PiPath },
    { name: "name", icon: BsMusicNote },
  ];

  const handleSubmit = async (e: React.FormEvent | Event) => {
    e.preventDefault();
    setLocation("/search-results");
    const res = await handleSearch(phrase, activeFilters);
    setAudioFiles(res);
  };
  const handleChange = (e: any) => {
    useQueryStore.setState((state) => ({ ...state, search: e.target.value }));
  };

  const toggleActiveFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter((f) => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  return (
    <Box display={"flex"} flexDir={"column"}>
      {focused ? (
        <Box
          pos={"absolute"}
          top={0}
          left={0}
          width={"100%"}
          height={"100%"}
          zIndex={3}
          onClick={(e) => {
            e.stopPropagation();
            setFocused(false);
          }}
        ></Box>
      ) : null}
      <Box
        pos={"relative"}
        display={"flex"}
        className="search-bar"
        flexDir={"column"}
        onFocus={() => setFocused(true)}
        zIndex={4}
      >
        <form onSubmit={handleSubmit}>
          <InputGroup
            endElement={
              <ChakraIcon
                icon={FaMagnifyingGlass}
                _hover={{ cursor: "pointer" }}
                onClick={handleSubmit}
              />
            }
          >
            <Input
              ref={searchRef}
              value={phrase}
              onChange={handleChange}
              size={"md"}
              placeholder="Search for your tunes!"
              _focus={{ outline: "none", borderColor: "brand.600" }}
              bg={getNeutral("light", 800)}
              _dark={{
                bg: getNeutral("dark", 800),
              }}
            />
          </InputGroup>
        </form>
        {focused ? (
          <Box
            pos={"absolute"}
            top={10}
            width={"100%"}
            bg={getNeutral("light", 800)}
            _dark={{
              bg: getNeutral("dark", 800),
              borderColor: getNeutral("dark", 700),
            }}
            border={"1px solid"}
            borderColor={getNeutral("light", 700)}
            mt={"2"}
            onClick={(e) => {
              e.stopPropagation();
            }}
            p={"2"}
            borderRadius={"lg"}
            display={"flex"}
            flexDir={"column"}
            textAlign={"left"}
            gap={2}
          >
            <Box>
              <Text
                fontSize={"md"}
                fontWeight={"500"}
                fontFamily={"sans-serif"}
              >
                Search in
              </Text>
            </Box>
            <Box
              display={"flex"}
              gap={"2"}
              p={"2"}
              borderRadius={"lg"}
              bg={getNeutral("light", 900)}
              _dark={{
                bg: getNeutral("dark", 900),
              }}
            >
              {filters.map((item) => {
                return (
                  <Box
                    width={"5rem"}
                    key={item.name}
                    bg={
                      activeFilters.includes(item.name)
                        ? getBrandWithAlpha(300, 1)
                        : "none"
                    }
                    _dark={{
                      bg: activeFilters.includes(item.name)
                        ? getBrandWithAlpha(200, 0.2)
                        : "none",
                      color: activeFilters.includes(item.name)
                        ? getBrandWithAlpha(300, 1)
                        : getNeutral("dark", 300),
                    }}
                    borderColor={getBrandWithAlpha(400, 0.7)}
                    onClick={() => {
                      toggleActiveFilter(item.name);
                    }}
                    display={"flex"}
                    flexDir={"column"}
                    gap={2}
                    alignItems={"center"}
                    p={2}
                    borderRadius={"md"}
                    color={
                      activeFilters.includes(item.name)
                        ? getBrandWithAlpha(800, 1)
                        : getNeutral("light", 300)
                    }
                  >
                    <ChakraIcon icon={item.icon} boxSize={5} />
                    <Text fontSize={"xs"}>{item.name}</Text>
                  </Box>
                );
              })}
            </Box>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};
