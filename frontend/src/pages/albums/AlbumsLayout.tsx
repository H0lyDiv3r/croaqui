import { Box } from "@chakra-ui/react";
import { Route, Switch, useRoute } from "wouter";
import { Albums } from "./Albums";
import { AlbumDetail } from "./AlbumDetail";
import { useQueueStore } from "@/store";
import { useEffect } from "react";

export const AlbumsLayout = () => {
  const shuffle = useQueueStore((state) => state.shuffle);
  const [match, params] = useRoute("/albums/:albumId");

  useEffect(() => {}, [params]);
  return (
    <Box display={"flex"} width={"100%"}>
      <Switch>
        <Route path={"/"} component={Albums} />
        <Route path={"/:id"} component={AlbumDetail} />
      </Switch>
    </Box>
  );
};
