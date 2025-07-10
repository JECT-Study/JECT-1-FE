import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

import XIcon from "@/components/icons/X";
import {
  useApplyEditProfile,
  useCancelEditProfile,
} from "@/stores/useEditProfileStore";

export default function EditProfileHeader() {
  const cancelEdit = useCancelEditProfile();
  const applyEdit = useApplyEditProfile();
  return (
    <View
      aria-label="edit profile header"
      className="relative flex h-[60px] w-full flex-row items-center justify-between border-2 border-gray-100 p-4"
    >
      {/* 왼쪽 아이콘 */}
      <Pressable
        onPress={() => {
          cancelEdit();
          router.replace("/my");
        }}
        className="w-[60px] items-start"
      >
        <XIcon size={24} />
      </Pressable>

      {/* 중앙 타이틀 */}
      <View className="flex-1 items-center">
        <Text className="text-[18px] font-semibold text-[#383535]">
          프로필 수정
        </Text>
      </View>

      {/* 오른쪽 완료 */}
      <Pressable
        onPress={() => {
          applyEdit();
          router.replace("/my");
        }}
        className="w-[60px] items-end"
      >
        <Text className="text-[16px] text-[#383535]">완료</Text>
      </Pressable>
    </View>
  );
}
