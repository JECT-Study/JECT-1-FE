import { router } from "expo-router";
import { Pressable, SafeAreaView, Text, View } from "react-native";

import LogoutModal from "@/components/mypage/LogoutModal";
import MyMenus from "@/components/mypage/MyMenus";
import MyPageMenus from "@/components/mypage/MyPageMenus";
import UserInfo from "@/components/mypage/UserInfo";

export default function MyScreen() {
  return (
    <SafeAreaView className="w-full flex-1 bg-white">
      <Text className="ml-6 mt-6 text-[18px]">마이페이지</Text>
      <UserInfo />
      <Pressable
        className="mx-6 mt-6 flex h-[32px] items-center justify-center rounded-[4px] bg-gray-100"
        onPress={() => router.push("/my/edit_profile")}
      >
        <Text className="text-[12px]">프로필 수정</Text>
      </Pressable>
      <MyMenus />
      <View
        aria-label="seperator"
        className="my-2 h-[12px] w-full bg-[#F2F2F7]"
      />
      <MyPageMenus />
      <LogoutModal />
    </SafeAreaView>
  );
}
