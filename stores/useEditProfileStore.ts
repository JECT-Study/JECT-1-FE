import { create } from "zustand/react";

interface EditProfileStore {
  profileNickname: string;
  profileImageUri: string;
  tempNickname: string;
  tempUri: string;
  action: {
    setProfileNickname: (value: string) => void;
    setProfileImageUrl: (value: string) => void;
    setTempImageUrl: (value: string) => void;
    setTempNickname: (value: string) => void;
    applyChanges: () => void;
    cancelChanges: () => void;
  };
}

const useEditProfileStore = create<EditProfileStore>((set, get) => ({
  profileNickname: "기본닉네임",
  profileImageUri: "https://avatars.githubusercontent.com/u/156386797?v=4",
  tempNickname: "기본닉네임",
  tempUri: "https://avatars.githubusercontent.com/u/156386797?v=4",
  action: {
    setProfileNickname: (value: string) =>
      set(() => ({ profileNickname: value })),
    setProfileImageUrl: (value: string) =>
      set(() => ({ profileImageUri: value })),
    setTempNickname: (value: string) => set(() => ({ tempNickname: value })),
    setTempImageUrl: (value: string) => set(() => ({ tempUri: value })),
    applyChanges: () => {
      const { tempNickname, tempUri } = get();
      set({
        profileNickname: tempNickname,
        profileImageUri: tempUri,
      });
    },

    cancelChanges: () => {
      const { profileNickname, profileImageUri } = get();
      set({
        tempNickname: profileNickname,
        tempUri: profileImageUri,
      });
    },
  },
}));

export const useProfileNickname = () =>
  useEditProfileStore((state) => state.profileNickname);
export const useProfileImageUri = () =>
  useEditProfileStore((state) => state.profileImageUri);
export const useTempNickname = () =>
  useEditProfileStore((state) => state.tempNickname);
export const useTempImageUri = () =>
  useEditProfileStore((state) => state.tempUri);

export const useSetProfileNickname = () =>
  useEditProfileStore((state) => state.action.setProfileNickname);
export const useSetProfileImageUri = () =>
  useEditProfileStore((state) => state.action.setProfileImageUrl);
export const useSetTempImageUri = () =>
  useEditProfileStore((state) => state.action.setTempImageUrl);
export const useSetTempNickname = () =>
  useEditProfileStore((state) => state.action.setTempNickname);
export const useApplyEditProfile = () =>
  useEditProfileStore((state) => state.action.applyChanges);
export const useCancelEditProfile = () =>
  useEditProfileStore((state) => state.action.cancelChanges);
