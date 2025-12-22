import {
  GetContents,
  GetStandardDirs,
  RemoveDir,
  ScanForAudio,
} from "wailsjs/go/media/Media";

export const getStandardDirs = async () => {
  const res = await GetStandardDirs();
  if (!res) {
    return;
  }

  return res.data.dirs;
};

export const getDirContents = async (path: string) => {
  const res = await GetContents(path);
  if (!res) {
    return;
  }

  return res.data;
};
export const handleScan = async (path: string) => {
  await ScanForAudio(path);
};

export const handleRemoveDir = async (path: string) => {
  await RemoveDir(path);
};
