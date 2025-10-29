import { Box, Icon, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useEffect } from "react";
import { FaInfo } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { PiWarningFill } from "react-icons/pi";
import { TbCheck } from "react-icons/tb";
import { ChakraIcon } from "./ChackraIcon";

export const Toast = ({
  data = { status: "success", message: "successful", delay: 3000 },
  onClose = () => {},
  cw = 0,
}) => {
  const MotionBox = motion(Box);
  const [width, setWidth] = useState(0);
  const bg: Record<string, string> = {
    error: "hsl(353deg, 80%, 50%)",
    success: "hsl(147deg,80%,37%)",
    info: "hsl(218.4, 79.8%, 50%)",
    warning: "hsl(16.6, 80.2%, 50.6%)",
  };
  const lights: Record<string, string> = {
    warning: "hsl(353deg,90%,53%)",
    success: "hsl(148deg,83%,47%)",
    info: "hsl(218.7, 75.1%, 57.5%)",
  };
  const darks: Record<string, string> = {
    error: "hsl(351.4, 91.3%, 22.5%)",
    success: "hsl(146, 89%, 21.4%)",
    info: "hsl(218.7, 80.4%, 22%)",
    warning: "hsl(15.3, 80.4%, 22%)",
  };

  const icons = {
    warning: PiWarningFill,
    success: TbCheck,
    info: FaInfo,
    error: FaXmark,
  };

  useEffect(() => {
    let timer = setTimeout(() => {
      onClose();
    }, data.delay);
    return () => clearTimeout(timer);
  }, [onClose]);
  useEffect(() => {
    setWidth(cw / 2 - 150);
  }, []);

  return (
    <MotionBox
      initial={{ y: 30, opacity: 0, scale: 0.9 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 100, opacity: 0, scale: 0.7 }}
      transition={{
        delay: 0.2,
        duration: 0.2,
        ease: "easeIn",
      }}
      zIndex={9999}
      bg={bg[data.status]}
      // bgImage={`linear-gradient(145deg,${bg[data.status]},${lights[data.status]})`}
      color={"white"}
      pos={"absolute"}
      bottom={"5%"}
      left={width}
      width={"300px"}
      height={"4rem"}
      p={"16px"}
      borderRadius={"md"}
      display={"flex"}
      justifyContent={"space-between"}
      alignItems={"center"}
      fontSize={"14px"}
    >
      <Box pos={"absolute"} top={"-8px"} left={"-8px"}>
        <Box
          bg={darks[data.status]}
          display={"flex"}
          borderRadius={"50px"}
          border={"3px solid"}
          borderColor={bg[data.status]}
          justifyContent={"center"}
          alignItems={"center"}
          p={"5px"}
          width={"fit-content"}
        >
          <ChakraIcon
            icon={icons[data.status as keyof typeof icons]}
            boxSize={5}
          />
        </Box>
      </Box>
      <Box width={"100%"} display={"flex"} justifyContent={"space-between"}>
        <Text>{data.message}</Text>
        <ChakraIcon
          icon={IoClose}
          boxSize={5}
          onClick={() => onClose()}
          _hover={{ cursor: "pointer" }}
        />
      </Box>

      {/*<Icon as={IoClose} boxSize={5} onClick={() => onClose()} />*/}
    </MotionBox>
  );
};
