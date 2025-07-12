import { create } from "zustand/react";

import { categoryUnion } from "@/constants/Filter";

interface CategoryStore {
  selected: categoryUnion;
  action: {
    setSelected: (value: categoryUnion) => void;
  };
}

const useCategoryStore = create<CategoryStore>((set) => ({
  selected: "all",
  action: {
    setSelected: (value: categoryUnion) => set({ selected: value }),
  },
}));

export const useCategorySelected = () =>
  useCategoryStore((state) => state.selected);
export const useSetCategorySelect = () =>
  useCategoryStore((state) => state.action.setSelected);
