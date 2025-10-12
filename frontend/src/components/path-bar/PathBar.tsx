import { useNavigationStore } from "@/store";
import { Box, Button, Text } from "@chakra-ui/react";

export const PathBar = () => {
  const currentPath = useNavigationStore((state) => state.currentPath);
  return (
    <Box
      bg="neutral.dark.900"
      color="neutral.light.100"
      px={4}
      py={2}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <Text fontSize="sm" whiteSpace={"nowrap"} overflow={"hidden"}>
        {currentPath.split("/").map((path, index) => (
          <span key={index}>
            {path}
            {index < currentPath.length - 1 && "/ "}
          </span>
        ))}
      </Text>
    </Box>
  );
};
