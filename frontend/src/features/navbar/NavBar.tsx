import { Logo, Navigation, SearchBar, Settings } from "@/components/nav";
import { Box, Grid, GridItem } from "@chakra-ui/react";

export const NavBar = () => {
  return (
    <Box
      className="navbar"
      display={"flex"}
      alignItems={"center"}
      height={"5rem"}
      justifyContent={"center"}
    >
      <Grid templateColumns="repeat(24, 1fr)" width={"80%"} gap={"6"}>
        <GridItem colSpan={8} justifyContent={"center"} alignItems={"center"}>
          <Logo />
        </GridItem>
        <GridItem colSpan={8}>
          <SearchBar />
        </GridItem>
        <GridItem
          colSpan={8}
          display={"flex"}
          gap={"6"}
          justifyContent={"end"}
          alignItems={"center"}
        >
          <Navigation />
          <Settings />
        </GridItem>
      </Grid>
    </Box>
  );
};
