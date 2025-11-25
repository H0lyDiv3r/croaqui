//@ts-nocheck
import { Box, EmptyState, Text, VStack } from "@chakra-ui/react";
import { TbPlaylistOff } from "react-icons/tb";
import { BsFolder2Open } from "react-icons/bs";
import { MdMusicOff } from "react-icons/md";
import { Track } from "@chakra-ui/react/dist/types/components/progress/namespace";

const EmptyPlaylist = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
    >
      <EmptyState.Root size="md">
        <EmptyState.Content>
          <EmptyState.Indicator>
            <TbPlaylistOff />
          </EmptyState.Indicator>
          <VStack textAlign="center">
            <EmptyState.Title>OOPS! Can't Find Any Playlists</EmptyState.Title>
            <EmptyState.Description whiteSpace={"break-spaces"}>
              We can't find any playlists.
            </EmptyState.Description>
          </VStack>
        </EmptyState.Content>
      </EmptyState.Root>
    </Box>
  );
};

const EmptyDirectory = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
    >
      <EmptyState.Root size="md">
        <EmptyState.Content>
          <EmptyState.Indicator>
            <BsFolder2Open />
          </EmptyState.Indicator>
          <VStack textAlign="center">
            <EmptyState.Title>
              OOPS! Can't Find Any Directories
            </EmptyState.Title>
            <EmptyState.Description whiteSpace={"break-spaces"}>
              We can't find any directories.
            </EmptyState.Description>
          </VStack>
        </EmptyState.Content>
      </EmptyState.Root>
    </Box>
  );
};

const EmptyMusic = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
    >
      <EmptyState.Root size="md">
        <EmptyState.Content>
          <EmptyState.Indicator>
            <MdMusicOff />
          </EmptyState.Indicator>
          <VStack textAlign="center">
            <EmptyState.Title>OOPS! Can't Find Any Music</EmptyState.Title>
            <EmptyState.Description whiteSpace={"break-spaces"}>
              We can't find any Music.
            </EmptyState.Description>
          </VStack>
        </EmptyState.Content>
      </EmptyState.Root>
    </Box>
  );
};

const EmptyTrack = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
    >
      <EmptyState.Root size="md">
        <EmptyState.Content>
          <EmptyState.Indicator>
            <MdMusicOff />
          </EmptyState.Indicator>
          <VStack textAlign="center">
            <EmptyState.Title>Get the party started!!</EmptyState.Title>
            <EmptyState.Description whiteSpace={"break-spaces"}>
              you dont have music playing.
            </EmptyState.Description>
          </VStack>
        </EmptyState.Content>
      </EmptyState.Root>
    </Box>
  );
};

export const Empty = {
  Playlist: EmptyPlaylist,
  Directory: EmptyDirectory,
  Music: EmptyMusic,
  Track: EmptyTrack,
};
