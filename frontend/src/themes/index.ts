import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import { colors } from "./colors";

const config = defineConfig({
  theme: {
    tokens: {
      colors: colors,
    },
  },
});

export const system = createSystem(defaultConfig, config);
