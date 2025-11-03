import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import { colors } from "./colors";
import { fonts } from "./fonts";

const config = defineConfig({
  theme: {
    tokens: {
      colors: colors,
      fonts: fonts,
    },
    semanticTokens: {
      fonts: {
        body: { value: "{fonts.rubik}" },
        heading: { value: "{fonts.rubik}" },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
