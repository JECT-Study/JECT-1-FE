import { create } from "zustand/react";

interface UserStore {
  nickname: string;
  profileImage: string;
  isLoggedIn: boolean;
  action: {
    setUserInfo: (nickname: string, profileImage: string) => void;
    setNickname: (nickname: string) => void;
    setProfileImage: (profileImage: string) => void;
    setLoggedIn: (isLoggedIn: boolean) => void;
    clearUserInfo: () => void;
  };
}

const useUserStore = create<UserStore>((set) => ({
  nickname: "",
  profileImage: "",
  isLoggedIn: false,
  action: {
    setUserInfo: (nickname: string, profileImage: string) =>
      set(() => ({
        nickname,
        profileImage,
        isLoggedIn: true,
      })),
    setNickname: (nickname: string) =>
      set(() => ({ nickname })),
    setProfileImage: (profileImage: string) =>
      set(() => ({ profileImage })),
    setLoggedIn: (isLoggedIn: boolean) =>
      set(() => ({ isLoggedIn })),
    clearUserInfo: () =>
      set(() => ({
        nickname: "",
        profileImage: "",
        isLoggedIn: false,
      })),
  },
}));

// Selectors
export const useNickname = () =>
  useUserStore((state) => state.nickname);
export const useProfileImage = () =>
  useUserStore((state) => state.profileImage);
export const useIsLoggedIn = () =>
  useUserStore((state) => state.isLoggedIn);

// Actions
export const useSetUserInfo = () =>
  useUserStore((state) => state.action.setUserInfo);
export const useSetNickname = () =>
  useUserStore((state) => state.action.setNickname);
export const useSetProfileImage = () =>
  useUserStore((state) => state.action.setProfileImage);
export const useSetLoggedIn = () =>
  useUserStore((state) => state.action.setLoggedIn);
export const useClearUserInfo = () =>
  useUserStore((state) => state.action.clearUserInfo);

export default useUserStore;