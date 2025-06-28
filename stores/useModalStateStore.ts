import { create } from "zustand/react";

type ModalStoreType = {
  nicknameModalState: boolean;
  logoutModalState: boolean;
  action: {
    setNicknameModalState: (value: boolean) => void;
    setLogoutModalState: (value: boolean) => void;
  };
};

const useModalStateStore = create<ModalStoreType>((set) => ({
  nicknameModalState: false,
  logoutModalState: false,
  action: {
    setNicknameModalState: (value: boolean) =>
      set(() => ({ nicknameModalState: value })),
    setLogoutModalState: (value: boolean) =>
      set(() => ({ logoutModalState: value })),
  },
}));

// 닉네임 모달 export
export const useNicknameModalState = () =>
  useModalStateStore((state) => state.nicknameModalState);
export const useSetNicknameModalState = () =>
  useModalStateStore((state) => state.action.setNicknameModalState);

// 로그아웃 모달 export
export const useLogoutModalState = () =>
  useModalStateStore((state) => state.logoutModalState);
export const useSetLogoutModalState = () =>
  useModalStateStore((state) => state.action.setLogoutModalState);
