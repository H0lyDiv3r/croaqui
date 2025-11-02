import { TabListItem } from "@/types";
import { getNeutral } from "@/utils";
import { Box, Field, Input, Tabs, Text, useDisclosure } from "@chakra-ui/react";
import { ChakraIcon } from "../ChackraIcon";
import { RiExpandLeftFill } from "react-icons/ri";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import React, { Suspense, useEffect, useState } from "react";
import { CreatePlaylistForm } from "../forms";
import { AnimatePresence, motion } from "framer-motion";

const TabsList: any = Tabs.List;
const TabsTrigger: any = Tabs.Trigger;
const TabsIndicator: any = Tabs.Indicator;

const DirScanner = React.lazy(() => import("../dir-tree/DirScanner"));

export const SideBarActionTabs = ({
  tabs,
  tabList,
  handleHide,
  showPlaylistForm,
  handleOpenForm,
  handlePlaylistFormSubmission,
}: {
  tabs: Tabs.UseTabsReturn;
  tabList: TabListItem[];
  handleHide: (target: boolean) => void;
  showPlaylistForm: boolean;
  handleOpenForm: (target: boolean) => void;
  handlePlaylistFormSubmission: (value: string) => void;
}) => {
  const MotionBox = motion(Box);

  const { open, setOpen } = useDisclosure();

  useEffect(() => {
    // Add your effect logic here
    handleOpenForm(false);
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
            onClick={() => {
              if (tabs.value === "dir") {
                handleOpenForm(false);
                setOpen(true);
              } else {
                handleOpenForm(!showPlaylistForm);
              }
            }}
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
          <Suspense>
            <DirScanner
              open={open}
              setOpen={(target: boolean) => {
                setOpen(target);
              }}
            />
          </Suspense>
        </Box>
      </Box>
      <AnimatePresence>
        {showPlaylistForm ? (
          <MotionBox>
            <CreatePlaylistForm handleSubmit={handlePlaylistFormSubmission} />
          </MotionBox>
        ) : null}
      </AnimatePresence>
    </Box>
  );
};
