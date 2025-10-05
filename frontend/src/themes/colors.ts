import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

export const colors = {
  neutral: {
    dark: {
      100: { value: "#e6e8ef" }, // very light cool gray with subtle blue tint
      200: { value: "#bfc4d1" },
      300: { value: "#9aa0b3" },
      400: { value: "#757c95" },
      500: { value: "#5b627a" },
      600: { value: "#454a5d" },
      700: { value: "#2f3340" },
      800: { value: "#1f2430" },
      900: { value: "#121721" },
    },
  },
  brand: {
    900: { value: "#40421a" }, // deeper, richer olive with cooler undertones
    800: { value: "#5B622D" }, // dark olive-green with a hint of blue
    700: { value: "#76823F" }, // balanced dark olive with more saturation
    600: { value: "#90A252" }, // medium-dark olive with fresh tone
    500: { value: "#abc265" }, // warm olive-yellow green
    400: { value: "#BDD07E" }, // lighter warm green with yellow hint
    300: { value: "#CFDD96" }, // soft pastel green-yellow
    200: { value: "#E1EBAF" }, // pale warm yellow-green
    100: { value: "#f3f8c7" },
  },
  support: {
    green: { value: "#b2c249" },
  },
};
