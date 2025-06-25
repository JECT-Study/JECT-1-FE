import { create } from "zustand/react";

type ModalStoreType = {
  nicknameModalState: boolean;
  action: {
    setNicknameModalState: (value: boolean) => void;
  };
};

const useModalStateStore = create<ModalStoreType>((set) => ({
  nicknameModalState: false,
  action: {
    setNicknameModalState: (value: boolean) =>
      set(() => ({ nicknameModalState: value })),
  },
}));

export const useNicknameModalState = () =>
  useModalStateStore((state) => state.nicknameModalState);
export const useSetNicknameModalState = () =>
  useModalStateStore((state) => state.action.setNicknameModalState);
