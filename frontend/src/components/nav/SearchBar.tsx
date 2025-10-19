import { Box, Input, InputGroup } from "@chakra-ui/react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { ChakraIcon } from "../ChackraIcon";
import { getNeutral } from "@/utils";

export const SearchBar = () => {
  return (
    <Box display={"flex"} className="search-bar">
      <InputGroup
        endElement={
          <ChakraIcon icon={FaMagnifyingGlass} _hover={{ cursor: "pointer" }} />
        }
      >
        <Input
          size={"md"}
          placeholder="Search for your tunes!"
          _focus={{ outline: "none", borderColor: "brand.600" }}
          bg={getNeutral("light", 800)}
          _dark={{
            bg: getNeutral("dark", 800),
          }}
        />
      </InputGroup>
    </Box>
  );
};
