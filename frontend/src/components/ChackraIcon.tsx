import { Icon, IconProps } from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons";

export const ChakraIcon = ({
  icon,
  ...props
}: { icon: IconType } & IconProps) => (
  <Icon as={icon as React.ElementType} {...props} />
);
