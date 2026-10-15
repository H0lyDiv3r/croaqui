import { getBrandWithAlpha, getNeutral } from "@/utils";
import { Box, Field, Input, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { DefaultButton } from "../buttons";
import { ChakraIcon } from "../ChackraIcon";
import { MdCheck, MdContentCopy } from "react-icons/md";
import { Connect } from "../../../wailsjs/go/stream/Stream";
import { EventsOn } from "../../../wailsjs/runtime";
import { Events } from "@/events/events";

const FieldLabel: any = Field.Label;

export const ConnectionForm = () => {
  const [isHost, setIsHost] = useState<boolean>(true);
  const [roomKey, setRoomKey] = useState("");
  const [hostKey, setHostKey] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const cancel = EventsOn(Events.StreamRoomKeyGenerated, (key: string) => {
      setHostKey(key);
    });

    return () => {
      cancel();
    };
  }, []);

  const handleCopyKey = () => {
    if (!hostKey) return;
    try {
      const textarea = document.createElement("textarea");
      textarea.value = hostKey;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    } catch {
      navigator.clipboard?.writeText(hostKey);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isStartDisabled = !isHost && !roomKey.trim();

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
      <Text fontWeight={500}>Connection</Text>

      <Box mt={"4"}>
        <Box
          display="flex"
          gap={1}
          bg={getNeutral("light", 900)}
          _dark={{ bg: getNeutral("dark", 900) }}
          p={1}
          borderRadius="md"
          mb={3}
        >
          <Box
            as="button"
            flex={1}
            py={1}
            px={2}
            fontSize="xs"
            fontWeight={500}
            textAlign="center"
            borderRadius="sm"
            cursor="pointer"
            outline="none"
            transition="none"
            bg={isHost ? getBrandWithAlpha(400, 0.3) : "transparent"}
            color={isHost ? "brand.700" : getNeutral("light", 500)}
            _dark={{
              color: isHost
                ? getBrandWithAlpha(100, 1)
                : getNeutral("dark", 200),
            }}
            _hover={{
              bg: isHost
                ? getBrandWithAlpha(400, 0.3)
                : getBrandWithAlpha(400, 0.1),
            }}
            _focus={{ outline: "none" }}
            onClick={() => setIsHost(true)}
          >
            Host
          </Box>
          <Box
            as="button"
            flex={1}
            py={1}
            px={2}
            fontSize="xs"
            fontWeight={500}
            textAlign="center"
            borderRadius="sm"
            cursor="pointer"
            outline="none"
            transition="none"
            bg={!isHost ? getBrandWithAlpha(400, 0.3) : "transparent"}
            color={!isHost ? "brand.700" : getNeutral("light", 500)}
            _dark={{
              color: !isHost
                ? getBrandWithAlpha(100, 1)
                : getNeutral("dark", 200),
            }}
            _hover={{
              bg: !isHost
                ? getBrandWithAlpha(400, 0.3)
                : getBrandWithAlpha(400, 0.1),
            }}
            _focus={{ outline: "none" }}
            onClick={() => setIsHost(false)}
          >
            Peer
          </Box>
        </Box>

        <Box
          minH="60px"
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          {isHost ? (
            <Box width="100%">
              <Text
                fontSize="xs"
                color={getNeutral("light", 300)}
                _dark={{ color: getNeutral("dark", 300) }}
                mb={1}
              >
                Room Key
              </Text>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                px={3}
                height="36px"
                borderRadius="md"
                bg={getNeutral("light", 900)}
                border="1px solid"
                borderColor={getNeutral("light", 700)}
                _dark={{
                  bg: getNeutral("dark", 900),
                  borderColor: getNeutral("dark", 700),
                }}
              >
                <Text
                  fontSize="xs"
                  fontFamily="mono"
                  color={
                    hostKey
                      ? getNeutral("light", 200)
                      : getNeutral("light", 400)
                  }
                  _dark={{
                    color: hostKey
                      ? getNeutral("dark", 200)
                      : getNeutral("dark", 400),
                  }}
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  userSelect="text"
                  cursor="text"
                  _selection={{
                    bg: "brand.400",
                    color: "neutral.dark.900",
                  }}
                  style={{
                    WebkitUserSelect: "text",
                    userSelect: "text",
                  }}
                >
                  {hostKey || "Room key will appear here"}
                </Text>
                <Box
                  as="button"
                  p={1}
                  ml={2}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="sm"
                  transition="none"
                  bg={copied ? "brand.500" : "transparent"}
                  color={
                    copied ? getNeutral("light", 900) : getNeutral("light", 400)
                  }
                  _dark={{
                    color: copied
                      ? getNeutral("dark", 900)
                      : getNeutral("dark", 400),
                  }}
                  _hover={{
                    cursor: hostKey ? "pointer" : "default",
                    color: copied ? undefined : "brand.500",
                  }}
                  opacity={hostKey ? 1 : 0.5}
                  onClick={handleCopyKey}
                  title={copied ? "Copied!" : "Copy to clipboard"}
                >
                  <ChakraIcon
                    icon={copied ? MdCheck : MdContentCopy}
                    boxSize={4}
                  />
                </Box>
              </Box>
            </Box>
          ) : (
            <Field.Root
              width={"100%"}
              color={getNeutral("light", 300)}
              _dark={{ color: getNeutral("dark", 300) }}
            >
              <FieldLabel fontSize="xs">Room Key</FieldLabel>
              <Input
                value={roomKey}
                onChange={(e) => setRoomKey(e.target.value)}
                size={"sm"}
                placeholder="Enter room key"
                color={getNeutral("light", 400)}
                _focus={{ outline: "none", borderColor: "brand.600" }}
                bg={getNeutral("light", 900)}
                _dark={{
                  bg: getNeutral("dark", 900),
                  color: getNeutral("dark", 400),
                }}
                _selection={{
                  bg: "brand.400",
                  color: "neutral.dark.900",
                }}
                userSelect="text"
                style={{
                  WebkitUserSelect: "text",
                  userSelect: "text",
                }}
              />
            </Field.Root>
          )}
        </Box>

        <Box display={"flex"} justifyContent={"flex-end"} mt={3}>
          <DefaultButton
            type="button"
            disabled={isStartDisabled}
            opacity={isStartDisabled ? 0.5 : 1}
            cursor={isStartDisabled ? "not-allowed" : "pointer"}
            _hover={isStartDisabled ? { bg: "brand.500" } : { bg: "brand.400" }}

            onClick={() => {
              if (isHost) {
                Connect(isHost, "");
              } else {
                Connect(isHost, roomKey);
              }
            }}
          >
            Start
          </DefaultButton>
        </Box>
      </Box>
    </Box>
  );
};
