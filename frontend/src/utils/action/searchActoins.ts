import { SearchAudio } from "../../../wailsjs/go/media/Media";

export const handleSearch = async (phrase: string, filters: string[]) => {
  console.log("this is the phrase and this is the stapel", phrase);

  const searchResult = await SearchAudio(phrase, filters);

  if (!searchResult) {
    return;
  }

  console.log("i am showing search result", searchResult.data.songs);
  return searchResult.data.songs;
};
