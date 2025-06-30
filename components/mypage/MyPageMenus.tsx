import { router } from "expo-router";
import { Alert, View } from "react-native";

import MyPageMenu from "@/components/mypage/MyPageMenu";

const handleLogout = () => {
  Alert.alert(
    "로그아웃", // 타이틀
    "정말 로그아웃 하시겠어요?", // 메시지
    [
      {
        text: "취소",
        style: "default", // iOS에서 취소 강조
      },
      {
        text: "로그아웃",
        onPress: () => {
          // TODO 실제 로그아웃 로직
          console.log("로그아웃!");
        },
        style: "default",
      },
    ],
    { cancelable: true },
  );
};

export default function MyPageMenus() {
  return (
    <View className="w-full px-4">
      <MyPageMenu
        title="이용약관"
        onPress={() => router.push("/(tabs)/my/terms")}
        chevron={true}
      />
      <MyPageMenu title="로그아웃" onPress={handleLogout} chevron={true} />
      <MyPageMenu
        title="회원탈퇴"
        onPress={() => router.push("/my/withdrawal")}
        chevron={true}
      />
    </View>
  );
}
