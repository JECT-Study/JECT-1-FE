import { create } from "zustand/react";

interface UserStore {
  nickname: string;
  profileImage: string;
  userRegions: string[];
  isLoggedIn: boolean;
  action: {
    setUserInfo: (
      nickname: string,
      profileImage: string,
      userRegions?: string[],
    ) => void;
    setNickname: (nickname: string) => void;
    setProfileImage: (profileImage: string) => void;
    setUserRegions: (userRegions: string[]) => void;
    setLoggedIn: (isLoggedIn: boolean) => void;
    clearUserInfo: () => void;
  };
}

const useUserStore = create<UserStore>((set) => ({
  nickname: "",
  profileImage: "",
  userRegions: [],
  isLoggedIn: false,
  action: {
    setUserInfo: (
      nickname: string,
      profileImage: string,
      userRegions: string[] = [],
    ) =>
      set(() => ({
        nickname,
        profileImage,
        userRegions,
        isLoggedIn: true,
      })),
    setNickname: (nickname: string) => set(() => ({ nickname })),
    setProfileImage: (profileImage: string) => set(() => ({ profileImage })),
    setUserRegions: (userRegions: string[]) => set(() => ({ userRegions })),
    setLoggedIn: (isLoggedIn: boolean) => set(() => ({ isLoggedIn })),
    clearUserInfo: () =>
      set(() => ({
        nickname: "",
        profileImage: "",
        userRegions: [],
        isLoggedIn: false,
      })),
  },
}));

// Selectors
export const useNickname = () => useUserStore((state) => state.nickname);
export const useProfileImage = () =>
  useUserStore((state) => state.profileImage);
export const useUserRegions = () => useUserStore((state) => state.userRegions);
export const useIsLoggedIn = () => useUserStore((state) => state.isLoggedIn);

// Actions
export const useSetUserInfo = () =>
  useUserStore((state) => state.action.setUserInfo);
export const useSetNickname = () =>
  useUserStore((state) => state.action.setNickname);
export const useSetProfileImage = () =>
  useUserStore((state) => state.action.setProfileImage);
export const useSetUserRegions = () =>
  useUserStore((state) => state.action.setUserRegions);
export const useSetLoggedIn = () =>
  useUserStore((state) => state.action.setLoggedIn);
export const useClearUserInfo = () =>
  useUserStore((state) => state.action.clearUserInfo);

export default useUserStore;
