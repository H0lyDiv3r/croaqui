import { useEffect, useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import { getBrandWithAlpha, getNeutral } from "@/utils";
import { ChakraIcon } from "../ChackraIcon";
import { FaTowerBroadcast } from "react-icons/fa6";
import { Events } from "@/events/events";
import { EventsOn } from "../../../wailsjs/runtime";
import { GetStatus } from "../../../wailsjs/go/stream/Stream";

const getStatusConfig = (status: string) => {
  switch (status) {
    case "connected":
      return {
        label: "Connected",
        iconColor: "brand.500",
        darkIconColor: "brand.400",
        dotBg: "brand.400",
        darkDotBg: "brand.400",
        textColor: "brand.700",
        darkTextColor: getBrandWithAlpha(100, 1),
        badgeBg: getBrandWithAlpha(400, 0.25),
        darkBadgeBg: getBrandWithAlpha(400, 0.15),
        badgeBorder: getBrandWithAlpha(400, 0.4),
        darkBadgeBorder: getBrandWithAlpha(400, 0.3),
      };
    case "connecting":
      return {
        label: "Connecting...",
        iconColor: "brand.500",
        darkIconColor: "brand.400",
        dotBg: "brand.400",
        darkDotBg: "brand.300",
        textColor: "brand.700",
        darkTextColor: "brand.200",
        badgeBg: getBrandWithAlpha(300, 0.2),
        darkBadgeBg: getBrandWithAlpha(300, 0.12),
        badgeBorder: getBrandWithAlpha(300, 0.35),
        darkBadgeBorder: getBrandWithAlpha(300, 0.25),
      };
    case "error":
      return {
        label: "Error",
        iconColor: "#d96a6a",
        darkIconColor: "#e06c75",
        dotBg: "#e06c75",
        darkDotBg: "#e06c75",
        textColor: "#b83232",
        darkTextColor: "#e06c75",
        badgeBg: "rgba(224, 108, 117, 0.15)",
        darkBadgeBg: "rgba(224, 108, 117, 0.15)",
        badgeBorder: "rgba(224, 108, 117, 0.35)",
        darkBadgeBorder: "rgba(224, 108, 117, 0.3)",
      };
    case "disconnected":
    default:
      return {
        label: "Disconnected",
        iconColor: getNeutral("light", 400),
        darkIconColor: getNeutral("dark", 400),
        dotBg: getNeutral("light", 400),
        darkDotBg: getNeutral("dark", 400),
        textColor: getNeutral("light", 300),
        darkTextColor: getNeutral("dark", 300),
        badgeBg: getNeutral("light", 700),
        darkBadgeBg: getNeutral("dark", 700),
        badgeBorder: getNeutral("light", 600),
        darkBadgeBorder: getNeutral("dark", 600),
      };
  }
};

export const ConnectionStatus = () => {
  const [status, setStatus] = useState<string>("disconnected");

  useEffect(() => {
    GetStatus()
      .then((currentStatus) => {
        if (currentStatus) {
          setStatus(currentStatus);
        }
      })
      .catch(() => {});

    const cancel = EventsOn(Events.StreamStatusChanged, (newStatus: string) => {
      setStatus(newStatus);
    });

    return () => {
      if (cancel) {
        cancel();
      }
    };
  }, []);

  const config = getStatusConfig(status);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      px={2.5}
      py={1.5}
      borderRadius="md"
      border="1px solid"
      borderColor={getNeutral("light", 700)}
      bg={getNeutral("light", 800)}
      _dark={{
        borderColor: getNeutral("dark", 700),
        bg: getNeutral("dark", 800),
      }}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <ChakraIcon
          icon={FaTowerBroadcast}
          boxSize={3.5}
          color={config.iconColor}
          _dark={{ color: config.darkIconColor }}
        />
        <Text
          fontSize="xs"
          fontWeight={500}
          color={getNeutral("light", 200)}
          _dark={{ color: getNeutral("dark", 200) }}
        >
          Stream Status
        </Text>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        gap={1.5}
        px={2}
        py={0.5}
        borderRadius="full"
        border="1px solid"
        borderColor={config.badgeBorder}
        bg={config.badgeBg}
        _dark={{
          borderColor: config.darkBadgeBorder,
          bg: config.darkBadgeBg,
        }}
      >
        <Box
          w="6px"
          h="6px"
          borderRadius="full"
          bg={config.dotBg}
          _dark={{ bg: config.darkDotBg }}
          flexShrink={0}
        />
        <Text
          fontSize="xs"
          fontWeight={500}
          color={config.textColor}
          _dark={{ color: config.darkTextColor }}
        >
          {config.label}
        </Text>
      </Box>
    </Box>
  );
};
