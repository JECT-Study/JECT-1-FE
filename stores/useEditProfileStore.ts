import axios, { AxiosError } from "axios";
import * as ImagePicker from "expo-image-picker";
import { ImagePickerResult } from "expo-image-picker";
import { create } from "zustand/react";

import { UsersProfileUrl } from "@/constants/ApiUrls";
import useUserStore from "@/stores/useUserStore";

// 기본 프로필 이미지 (회색)
const DEFAULT_PROFILE_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTQiIGhlaWdodD0iOTQiIHZpZXdCb3g9IjAgMCA5NCA5NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDciIGN5PSI0NyIgcj0iNDciIGZpbGw9IiM5Q0EzQUYiLz4KPHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeD0iMjciIHk9IjI3Ij4KPHBhdGggZD0iTTIwIDIwQzI0LjQxODMgMjAgMjggMTYuNDE4MyAyOCAxMkMyOCA3LjU4MTcyIDI0LjQxODMgNCAyMCA0QzE1LjU4MTcgNCAxMiA3LjU4MTcyIDEyIDEyQzEyIDE2LjQxODMgMTUuNTgxNyAyMCAyMCAyMFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yMCAyNEM5IDI0IDAgMzMgMCA0NEg0MEMzNjAgMzMgMzEgMjQgMjAgMjRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+";

interface EditProfileStore {
  profileNickname: string;
  profileImageFromPicker: string;
  tempNickname: string;
  tempImageFromPicker: string;
  tempImageFile: ImagePicker.ImagePickerAsset | null;
  action: {
    setProfileNickname: (value: string) => void;
    setProfileImageFromPicker: (value: string) => void;
    setTempImageFromPicker: (
      pickerResult: ImagePicker.ImagePickerResult,
    ) => void;
    setTempNickname: (value: string) => void;
    applyChanges: () => Promise<void>;
    cancelChanges: () => void;
    initializeFromUserStore: () => void;
  };
}

const useEditProfileStore = create<EditProfileStore>((set, get) => ({
  profileNickname: "기본닉네임",
  profileImageFromPicker: DEFAULT_PROFILE_IMAGE,
  tempNickname: "기본닉네임",
  tempImageFromPicker: DEFAULT_PROFILE_IMAGE,
  tempImageFile: null,
  action: {
    setProfileNickname: (value: string) =>
      set(() => ({ profileNickname: value })),
    setProfileImageFromPicker: (value: string) =>
      set(() => ({ profileImageFromPicker: value })),
    setTempNickname: (value: string) => set(() => ({ tempNickname: value })),
    setTempImageFromPicker: (pickerResult: ImagePickerResult) => {
      if (
        !pickerResult.canceled &&
        pickerResult.assets &&
        pickerResult.assets[0]
      ) {
        const asset = pickerResult.assets[0];
        set(() => ({
          tempImageFromPicker: asset.uri,
          tempImageFile: asset,
        }));
      }
    },
    applyChanges: async () => {
      const { tempNickname, tempImageFile, tempImageFromPicker } = get();
      try {
        const formData = new FormData();

        formData.append("nickname", tempNickname);

        if (tempImageFile) {
          const fileName =
            tempImageFile.fileName || `profile_${Date.now()}.jpg`;
          const imageFile = {
            uri: tempImageFile.uri,
            type: tempImageFile.mimeType || "image/jpeg",
            name: fileName,
          } as any;

          // 여러 필드명 시도 - 서버가 어떤 필드명을 기대하는지 확인
          formData.append("profileImage", imageFile);
          // formData.append("image", imageFile);  // 대안 필드명
          // formData.append("file", imageFile);   // 대안 필드명
        }

        const response = await axios.patch(UsersProfileUrl, formData);

        set({
          profileNickname: tempNickname,
          profileImageFromPicker: tempImageFromPicker,
          tempImageFile: null,
        });
      } catch (e) {
        const axiosError = e as AxiosError;
        console.error("Profile update error:", {
          message: axiosError.message,
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
          url: axiosError.config?.url,
          method: axiosError.config?.method,
        });
        throw axiosError;
      }
    },

    cancelChanges: () => {
      const { profileNickname, profileImageFromPicker } = get();
      set({
        tempNickname: profileNickname,
        tempImageFromPicker: profileImageFromPicker,
        tempImageFile: null,
      });
    },
    initializeFromUserStore: () => {
      const userStore = useUserStore.getState();
      const nickname = userStore.nickname || "기본닉네임";
      const profileImage = userStore.profileImage || DEFAULT_PROFILE_IMAGE;

      set({
        profileNickname: nickname,
        profileImageFromPicker: profileImage,
        tempNickname: nickname,
        tempImageFromPicker: profileImage,
        tempImageFile: null,
      });
    },
  },
}));

export const useProfileNickname = () =>
  useEditProfileStore((state) => state.profileNickname);
export const useProfileImageUri = () =>
  useEditProfileStore((state) => state.profileImageFromPicker);
export const useTempNickname = () =>
  useEditProfileStore((state) => state.tempNickname);
export const useTempImageUri = () =>
  useEditProfileStore((state) => state.tempImageFromPicker);

export const useSetProfileNickname = () =>
  useEditProfileStore((state) => state.action.setProfileNickname);
export const useSetProfileImageUri = () =>
  useEditProfileStore((state) => state.action.setProfileImageFromPicker);
export const useSetTempImageUri = () =>
  useEditProfileStore((state) => state.action.setTempImageFromPicker);
export const useSetTempNickname = () =>
  useEditProfileStore((state) => state.action.setTempNickname);
export const useApplyEditProfile = () =>
  useEditProfileStore((state) => state.action.applyChanges);
export const useCancelEditProfile = () =>
  useEditProfileStore((state) => state.action.cancelChanges);
export const useInitializeFromUserStore = () =>
  useEditProfileStore((state) => state.action.initializeFromUserStore);
