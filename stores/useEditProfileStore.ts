import * as ImagePicker from "expo-image-picker";
import { ImagePickerResult } from "expo-image-picker";
import { create } from "zustand/react";

import useUserStore from "@/stores/useUserStore";

// 기본 프로필 이미지 (회색)
const DEFAULT_PROFILE_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTQiIGhlaWdodD0iOTQiIHZpZXdCb3g9IjAgMCA5NCA5NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDciIGN5PSI0NyIgcj0iNDciIGZpbGw9IiM5Q0EzQUYiLz4KPHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeD0iMjciIHk9IjI3Ij4KPHBhdGggZD0iTTIwIDIwQzI0LjQxODMgMjAgMjggMTYuNDE4MyAyOCAxMkMyOCA3LjU4MTcyIDI0LjQxODMgNCAyMCA0QzE1LjU4MTcgNCAxMiA3LjU4MTcyIDEyIDEyQzEyIDE2LjQxODMgMTUuNTgxNyAyMCAyMCAyMFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yMCAyNEM5IDI0IDAgMzMgMCA0NEg0MEMzNjAgMzMgMzEgMjQgMjAgMjRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+";

interface EditProfileStore {
  profileImageFromPicker: string;
  tempImageFromPicker: string;
  action: {
    setTempImageFromPicker: (
      pickerResult: ImagePicker.ImagePickerResult,
    ) => void;
    cancelChanges: () => void;
    initializeFromUserStore: () => void;
  };
}

const useEditProfileStore = create<EditProfileStore>((set) => ({
  profileImageFromPicker: DEFAULT_PROFILE_IMAGE,
  tempImageFromPicker: DEFAULT_PROFILE_IMAGE,
  action: {
    setTempImageFromPicker: (pickerResult: ImagePickerResult) => {
      if (
        !pickerResult.canceled &&
        pickerResult.assets &&
        pickerResult.assets[0]
      ) {
        const asset = pickerResult.assets[0];
        set(() => ({
          tempImageFromPicker: asset.uri,
        }));
      }
    },

    cancelChanges: () => {
      set((state) => ({
        tempImageFromPicker: state.profileImageFromPicker,
      }));
    },

    initializeFromUserStore: () => {
      const userStore = useUserStore.getState();
      const profileImage = userStore.profileImage || DEFAULT_PROFILE_IMAGE;

      set({
        profileImageFromPicker: profileImage,
        tempImageFromPicker: profileImage,
      });
    },
  },
}));

export const useTempImageUri = () =>
  useEditProfileStore((state) => state.tempImageFromPicker);

export const useSetTempImageUri = () =>
  useEditProfileStore((state) => state.action.setTempImageFromPicker);
export const useCancelEditProfile = () =>
  useEditProfileStore((state) => state.action.cancelChanges);
export const useInitializeFromUserStore = () =>
  useEditProfileStore((state) => state.action.initializeFromUserStore);
