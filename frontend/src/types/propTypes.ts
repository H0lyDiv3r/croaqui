import { IconType } from "react-icons";

export type TabListItem = {
  value: string;
  label: string;
  icon?: IconType;
};
export type QueueInfo = {
  type: "dir" | "album" | "playlist";
  args: string | null;
  shuffle: boolean;
};
