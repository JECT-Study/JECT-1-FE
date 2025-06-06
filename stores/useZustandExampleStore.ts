import { create } from "zustand/react";

type ZustandStoreState = {
  example: boolean;
  action: {
    toggle: () => void;
  };
};

export const useZustandExampleStore = create<ZustandStoreState>((set) => ({
  example: true,
  action: {
    toggle: () => set((state) => ({ example: !state.example })),
  },
}));
