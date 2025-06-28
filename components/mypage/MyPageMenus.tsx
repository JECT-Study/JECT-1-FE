import { View } from "react-native";

import MyPageMenu from "@/components/mypage/MyPageMenu";
import { router } from "expo-router";

export default function MyPageMenus() {
  return (
    <View className="w-full px-4">
      <MyPageMenu
        title="이용약관"
        onPress={() => router.push("/terms")}
        chevron={true}
      />
      <MyPageMenu
        title="로그아웃"
        onPress={() => console.log("로그아웃")}
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
