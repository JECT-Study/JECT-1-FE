import { SafeAreaView, Text, View } from "react-native";

import LogoutModal from "@/components/mypage/LogoutModal";
import MyMenus from "@/components/mypage/MyMenus";
import MyPageMenus from "@/components/mypage/MyPageMenus";
import NicknameModal from "@/components/mypage/NicknameModal";
import UserInfo from "@/components/mypage/UserInfo";

export default function MyScreen() {
  return (
    <SafeAreaView className="w-full flex-1 bg-white">
      <Text className="m-6 text-[20px] font-semibold">마이페이지</Text>
      <UserInfo />
      <MyMenus />
      <View
        aria-label="seperator"
        className="my-2 h-[12px] w-full bg-[#F2F2F7]"
      />
      <MyPageMenus />
      <NicknameModal />
      <LogoutModal />
    </SafeAreaView>
  );
}
