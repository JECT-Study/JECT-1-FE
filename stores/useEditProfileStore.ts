import axios, { AxiosError } from "axios";
import * as ImagePicker from "expo-image-picker";
import { ImagePickerResult } from "expo-image-picker";
import { create } from "zustand/react";

import { UsersProfileUrl } from "@/constants/ApiUrls";

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
  };
}

const useEditProfileStore = create<EditProfileStore>((set, get) => ({
  profileNickname: "기본닉네임",
  profileImageFromPicker:
    "https://avatars.githubusercontent.com/u/156386797?v=4",
  tempNickname: "기본닉네임",
  tempImageFromPicker: "https://avatars.githubusercontent.com/u/156386797?v=4",
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
          console.log("Uploading image:", {
            uri: tempImageFile.uri,
            type: tempImageFile.mimeType,
            name: fileName, // 수정된 파일명 출력
            originalName: tempImageFile.fileName,
            fileSize: tempImageFile.fileSize,
          });
        }

        console.log("Sending profile update:", { nickname: tempNickname });
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
