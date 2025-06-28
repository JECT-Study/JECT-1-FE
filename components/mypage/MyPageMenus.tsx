import { router } from "expo-router";
import { View } from "react-native";

import MyPageMenu from "@/components/mypage/MyPageMenu";
import { useSetLogoutModalState } from "@/stores/useModalStateStore";

export default function MyPageMenus() {
  const setIsOpen = useSetLogoutModalState();
  return (
    <View className="w-full px-4">
      <MyPageMenu
        title="이용약관"
        onPress={() => router.push("/(tabs)/my/terms")}
        chevron={true}
      />
      <MyPageMenu
        title="로그아웃"
        onPress={() => setIsOpen(true)}
        chevron={true}
      />
      <MyPageMenu
        title="회원탈퇴"
        onPress={() => console.log("회원탈퇴")}
        chevron={true}
      />
    </View>
  );
}
