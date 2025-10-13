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
    light: {
      900: { value: "#f7f8fa" }, // near-white with subtle cool tint
      800: { value: "#ebeef3" },
      700: { value: "#d8dde6" },
      600: { value: "#c3c9d7" },
      500: { value: "#a9b0c3" },
      400: { value: "#8b92a6" },
      300: { value: "#6b7387" },
      200: { value: "#4c5364" },
      100: { value: "#323746" }, // deep cool charcoal for light-mode text
    },
  },

  brand: {
    900: { value: "#2F3321" }, // deep mossy olive
    800: { value: "#49542E" }, // warm earthy olive
    700: { value: "#636F3B" }, // leafy olive with subtle sunlight
    600: { value: "#7E8948" }, // mellow sunlit green
    500: { value: "#98A556" }, // balanced warm green (main green)
    400: { value: "#B1C269" }, // soft lime-olive
    300: { value: "#C8DA82" }, // muted sunlight green
    200: { value: "#D9ED9E" }, // pale sun-kissed green
    100: { value: "#EDF8BC" }, // airy, gentle highlight
  },

  // brand: {
  //   900: { value: "#40421a" }, // deeper, richer olive with cooler undertones
  //   800: { value: "#5B622D" }, // dark olive-green with a hint of blue
  //   700: { value: "#76823F" }, // balanced dark olive with more saturation
  //   600: { value: "#90A252" }, // medium-dark olive with fresh tone
  //   500: { value: "#abc265" }, // warm olive-yellow green
  //   400: { value: "#BDD07E" }, // lighter warm green with yellow hint
  //   300: { value: "#CFDD96" }, // soft pastel green-yellow
  //   200: { value: "#E1EBAF" }, // pale warm yellow-green
  //   100: { value: "#f3f8c7" },
  // },

  support: {
    green: { value: "#b2c249" },
  },
};
