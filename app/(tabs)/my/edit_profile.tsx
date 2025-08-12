import { useEffect } from "react";

import { router } from "expo-router";
import { SafeAreaView } from "react-native";

import EditProfileImage from "@/components/mypage/EditProfileImage";
import EditProfileNickname from "@/components/mypage/EditProfileNickname";
import CustomHeader from "@/components/ui/CustomHeader";
import {
  useApplyEditProfile,
  useCancelEditProfile,
  useInitializeFromUserStore,
} from "@/stores/useEditProfileStore";

export default function EditProfile() {
  const cancelEdit = useCancelEditProfile();
  const applyEdit = useApplyEditProfile();
  const initializeFromUserStore = useInitializeFromUserStore();

  // 페이지 진입 시 userStore의 정보로 초기화
  useEffect(() => {
    initializeFromUserStore();
  }, [initializeFromUserStore]);

  return (
    <SafeAreaView className="w-full flex-1 items-center bg-white">
      <CustomHeader
        title="프로필 수정"
        isCommit={true}
        commit={() => {
          applyEdit();
          router.replace("/my");
        }}
        cancel={() => {
          cancelEdit();
          router.replace("/my");
        }}
      />
      <EditProfileImage />
      <EditProfileNickname />
    </SafeAreaView>
  );
}
