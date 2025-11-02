import {
  GetContents,
  GetStandardDirs,
  ScanForAudio,
} from "wailsjs/go/media/Media";

export const getStandardDirs = async () => {
  const res = await GetStandardDirs();
  if (!res) {
    return;
  }
  console.log("i am here i am here", res);

  return res.data.dirs;
};

export const getDirContents = async (path: string) => {
  const res = await GetContents(path);
  if (!res) {
    return;
  }
  console.log("i am here i am here", res);

  return res.data;
};
export const handleScan = async (path: string) => {
  await ScanForAudio(path);
};
