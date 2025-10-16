import { create } from "zustand";

// var filterSettings struct {
// 		Artist string `json:"artist"`
// 		Album  string `json:"album"`
// 		Genre  string `json:"genre"`
// 		Path   string `json:"path"`
// 		Title  string `json:"title"`
// 		Sort   []struct {
// 			Field string `json:"field"`
// 			Order string `json:"order"`
// 		} `json:"sort"`
// 		Limit  int `json:"limit"`
// 		Offset int `json:"offset"`
// 	}

type Sort = {
  field: string;
  order: string;
};

type QueryParams = {
  artist: string;
  album: string;
  genre: string;
  title: string;
  path: string;
  limit: number;
  sort: Sort[];
  hasMore: boolean;
  page: number;
};

type QueryAction = {
  setQueryParams: (params: QueryParams) => void;
};

export const useQueryStore = create<QueryParams & QueryAction>((set, get) => ({
  artist: "",
  album: "",
  genre: "",
  title: "",
  path: "/",
  limit: 40,
  sort: [],
  hasMore: true,
  page: 0,
  setQueryParams: (params: QueryParams) =>
    set((state) => {
      return { ...state, ...params };
    }),
}));
