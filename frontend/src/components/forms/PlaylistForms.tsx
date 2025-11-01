import { createPlaylist, getNeutral } from "@/utils";
import { Box, Button, Field, Input, Text } from "@chakra-ui/react";
import { useState } from "react";
import { DefaultButton } from "../buttons";
import { AnimatePresence, motion } from "framer-motion";

const FieldLabel: any = Field.Label;
export const CreatePlaylistForm = ({
  handleSubmit,
}: {
  handleSubmit: (value: string) => void;
}) => {
  const [name, setName] = useState("");

  return (
    <Box
      bg={getNeutral("light", 800)}
      border={"1px solid"}
      color={getNeutral("light", 200)}
      borderColor={getNeutral("light", 700)}
      borderRadius={"md"}
      _dark={{
        bg: getNeutral("dark", 800),
        borderColor: getNeutral("dark", 700),
        color: getNeutral("dark", 200),
      }}
      p={2}
      textAlign={"left"}
    >
      <Text fontWeight={500}>Create Playlist</Text>
      <Box mt={"6"} key="abc">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(name);
          }}
        >
          <Field.Root
            my={2}
            width={"100%"}
            color={getNeutral("light", 300)}
            _dark={{
              color: getNeutral("dark", 300),
            }}
          >
            <FieldLabel>Playlist Name</FieldLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              size={"md"}
              color={getNeutral("light", 400)}
              placeholder="Playlist Name"
              _focus={{ outline: "none", borderColor: "brand.600" }}
              bg={getNeutral("light", 900)}
              _dark={{
                bg: getNeutral("dark", 900),
                color: getNeutral("dark", 400),
              }}
            />
          </Field.Root>
          <Box display={"flex"} justifyContent={"flex-end"}>
            <DefaultButton type="submit" disabled={name.length === 0}>
              Create
            </DefaultButton>
          </Box>
        </form>
      </Box>
    </Box>
  );
};
