import { TabListItem } from "@/types";
import { getNeutral } from "@/utils";
import { Box, Field, Input, Tabs, Text } from "@chakra-ui/react";
import { ChakraIcon } from "../ChackraIcon";
import { RiExpandLeftFill } from "react-icons/ri";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { useEffect, useState } from "react";
import { CreatePlaylistForm } from "../forms";
import { AnimatePresence, motion } from "framer-motion";

const TabsList: any = Tabs.List;
const TabsTrigger: any = Tabs.Trigger;
const TabsIndicator: any = Tabs.Indicator;

export const SideBarActionTabs = ({
  tabs,
  tabList,
  handleHide,
}: {
  tabs: Tabs.UseTabsReturn;
  tabList: TabListItem[];
  handleHide: (target: boolean) => void;
}) => {
  const [showCreatePlaylistForm, setShowCreatePlaylistForm] = useState(false);
  const MotionBox = motion(Box);

  useEffect(() => {
    // Add your effect logic here
    setShowCreatePlaylistForm(false);
  }, [tabs.value]);
  return (
    <Box display={"flex"} flexDir={"column"} gap={2} mb={2}>
      <Box display="flex" gap="2">
        <Box
          bg={getNeutral("light", 800)}
          _dark={{ bg: getNeutral("dark", 800) }}
          rounded="l3"
          p="1"
        >
          <Box
            as={"button"}
            px={1}
            onClick={() => handleHide(false)}
            width={"100%"}
            height={"100%"}
            borderRadius={"md"}
            bg={"brand.400"}
            _dark={{
              borderColor: getNeutral("dark", 600),
              color: getNeutral("dark", 700),
            }}
            _hover={{
              cursor: "pointer",
              bg: "brand.500",
            }}
          >
            <ChakraIcon icon={RiExpandLeftFill} />
          </Box>
        </Box>
        <TabsList
          bg={getNeutral("light", 800)}
          _dark={{ bg: getNeutral("dark", 800) }}
          rounded="l3"
          p="1"
        >
          {tabList.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              color={
                tabs.value === tab.value
                  ? "brand.700"
                  : getNeutral("light", 500)
              }
            >
              {tab.icon && <ChakraIcon icon={tab.icon} />}
              {tab.label}
            </TabsTrigger>
          ))}
          <TabsIndicator rounded="l2" bg={"brand.300"} />
        </TabsList>
        <Box
          bg={getNeutral("light", 800)}
          _dark={{ bg: getNeutral("dark", 800) }}
          rounded="l3"
          p="1"
        >
          <Box
            as={"button"}
            px={2}
            onClick={() => setShowCreatePlaylistForm(!showCreatePlaylistForm)}
            width={"100%"}
            height={"100%"}
            borderRadius={"md"}
            bg={"brand.400"}
            borderColor={getNeutral("light", 600)}
            _dark={{
              borderColor: getNeutral("dark", 600),
              color: getNeutral("dark", 700),
            }}
            _hover={{
              cursor: "pointer",
              bg: "brand.500",
            }}
          >
            <ChakraIcon icon={MdOutlinePlaylistAdd} boxSize={5} />
          </Box>
        </Box>
      </Box>
      <AnimatePresence>
        {showCreatePlaylistForm ? (
          <MotionBox>
            <CreatePlaylistForm />
          </MotionBox>
        ) : null}
      </AnimatePresence>
    </Box>
  );
};
