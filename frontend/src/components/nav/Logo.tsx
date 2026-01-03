import { Box, Image, Text } from "@chakra-ui/react";

export const Logo = () => {
  return (
    <Box display={"flex"} className="logo" height="100%">
      {/*<Text fontSize={"2xl"} fontWeight={"bold"}>
        Croaqui
      </Text>*/}
      <Box height={"100%"}>
        <Image
          src={"/logo.svg"}
          alt="Logo"
          width="30px"
          height={"100%"}
          overflow="hidden"
        />
      </Box>
    </Box>
  );
};
