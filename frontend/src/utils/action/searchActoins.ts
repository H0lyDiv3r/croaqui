import { SearchAudio } from "../../../wailsjs/go/media/Media";

export const handleSearch = async (phrase: string, filters: string[]) => {
  const searchResult = await SearchAudio(phrase, filters);

  if (!searchResult) {
    return;
  }

  return searchResult.data.songs;
};
