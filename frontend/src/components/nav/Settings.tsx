import { Box } from "@chakra-ui/react";
import { SwitchTheme } from "../SwitchTheme";

export const Settings = () => {
  return (
    <Box display={"flex"} className="search-bar">
      <SwitchTheme />
    </Box>
  );
};
