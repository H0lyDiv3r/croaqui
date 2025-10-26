import { create } from "zustand";

type SidebarDisclosureState = {
  rightBarOpen: boolean;
  leftBarOpen: boolean;
  switch: () => void;
};

export const useSidebarDisclosure = create<SidebarDisclosureState>((set) => ({
  rightBarOpen: true,
  leftBarOpen: true,
  switch: () => {
    set((state) => {
      return {
        ...state,
        rightBarOpen: state.leftBarOpen,
        leftBarOpen: !state.leftBarOpen,
      };
    });
  },
}));
