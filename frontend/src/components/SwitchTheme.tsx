import { ColorModeButton, useColorMode } from "./ui/color-mode";

export const SwitchTheme = () => {
  const { toggleColorMode, colorMode } = useColorMode();
  return (
    <>
      <ColorModeButton></ColorModeButton>
    </>
  );
};
