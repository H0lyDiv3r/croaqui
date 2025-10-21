import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import { colors } from "./colors";
import { fonts } from "./fonts";

const config = defineConfig({
  theme: {
    tokens: {
      colors: colors,
      fonts: fonts,
    },
  },
});

export const system = createSystem(defaultConfig, config);
