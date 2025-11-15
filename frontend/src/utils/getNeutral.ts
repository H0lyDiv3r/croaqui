import { colors } from "@/themes/colors";

export const getNeutral = (mode: "light" | "dark", level: number) => {
  return `neutral.${mode}.${level}`;
};

export const getBrandWithAlpha = (val: number, alpha: number) => {
  // Remove leading #
  const hex = (colors.brand as any)[val].value.replace(/^#/, "");

  // Parse r, g, b values
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // Return rgba string
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  return;
};
