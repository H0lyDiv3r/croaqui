import { Box } from "@chakra-ui/react";
import { MusicList } from "./MusicList";
import {
  useDataStore,
  usePlayerStore,
  usePlaylistStore,
  useQueryStore,
  useQueueStore,
} from "@/store";
import { getAudio, getQueue, removeFromPlaylist } from "@/utils";
import { GetImage, GetStatus, LoadMusic } from "wailsjs/go/player/Player";
import { useEffect, useRef, useState } from "react";
import { EventsOn } from "wailsjs/runtime/runtime";

export const DirectoryDetail = () => {
  const audioFiles = useDataStore((state) => state.musicFiles);
  const scrollRef = useRef<HTMLDivElement>(null);
  const setAll = usePlayerStore((state) => state.setPlayerStatus);
  const setLoaded = usePlayerStore((state) => state.setLoaded);
  const setTrack = usePlayerStore((state) => state.setCurrentTrack);
  const currentPath = useDataStore((state) => state.currentPath);
  const currentPlaylist = useDataStore((state) => state.currentPlaylist);
  const playlist = usePlaylistStore((state) => state.playlists);
  const musicListPath = useDataStore((state) => state.musicListPath);
  const shuffle = useQueueStore((state) => state.shuffle);
  const [hovered, setHovered] = useState<number | null>(null);

  const setCurrentTrackImage = usePlayerStore(
    (state) => state.setCurrentTrackImage,
  );

  const getAudioFiles = async () => {
    const audioFiles = await getAudio({ hasMore: true, page: 0 });
    // setAll(audioFiles);
    useDataStore.setState((state) => ({
      ...state,
      currentPlaylist: null,
      musicFiles: [...audioFiles],
    }));
  };

  const handleScroll = async () => {
    const current = scrollRef.current;
    if (!current) return;
    if (currentPlaylist) return;
    if (current.scrollTop + current.clientHeight >= current.scrollHeight) {
      // getAudios(currentPath);
      const newPage = await getAudio({
        page: useQueryStore.getState().page + 1,
      });
      useQueryStore.setState((state) => ({
        ...state,
        page: state.hasMore ? state.page + 1 : state.page,
      }));
      if (!newPage) {
        return;
      }
      useDataStore.setState((state) => ({
        ...state,
        musicFiles: [...state.musicFiles, ...newPage],
      }));
    }
  };

  // const handleRemoveFromPlaylist = async (
  //   songId: number,
  //   currentPlaylistId: number,
  // ) => {
  //   const data = await removeFromPlaylist(songId, currentPlaylistId);
  //   useDataStore.setState((state) => ({
  //     ...state,
  //     musicFiles: state.musicFiles.filter((file) => file.id !== data),
  //   }));
  // };

  const loadAudio = (item: any) => {
    setLoaded(false);
    setTrack(item);
    LoadMusic(item.path);
  };

  const handleGetQueue = async () => {
    return await getQueue({
      type: "dir",
      args: musicListPath,
      shuffle: shuffle,
    });
  };

  useEffect(() => {
    // getAudio();
    // useQueryStore.setState((state) => {
    //   return { ...state, page: 0 };
    // });
    useQueryStore.getState().clearQuery();
    getAudioFiles();
  }, [currentPath]);

  useEffect(() => {
    // EventsOn("MPV:FILE_LOADED", () => {
    //   setLoaded(true);
    //   // setTrack(item);
    //   GetImage().then((res) => {
    //     setCurrentTrackImage(res.data.image);
    //   });
    //   GetStatus().then((res) => {
    //     setAll(res.data);
    //   });
    // });
  }, []);
  return (
    <Box height={"100%"}>
      <MusicList handleGetQueue={handleGetQueue} />
    </Box>
  );
};
