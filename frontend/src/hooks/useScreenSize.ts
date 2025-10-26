import { useMediaQuery } from "@chakra-ui/react";

export const useScreenSize = () => {
  const [isSmall, isMedium, isLarge, isExtraLarge] = useMediaQuery([
    "(max-width: 768px)",
    "(min-width: 769px) and (max-width: 1024px)",
    "(min-width: 1025px) and (max-width: 1280px)",
    "(min-width: 1281px)",
  ]);

  return {
    isSmall,
    isMedium,
    isLarge,
    isExtraLarge,
  };
};
