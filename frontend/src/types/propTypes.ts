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
export type Song = {
  album: string;
  artist: string;
  duration: string;
  favorite: boolean;
  genre: string;
  id: number;
  name: string;
  parentPath: string;
  path: string;
  title: string;
};
