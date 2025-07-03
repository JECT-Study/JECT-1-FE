import { Alert, View } from "react-native";

import MyPageMenu from "@/components/mypage/MyPageMenu";
import usePageNavigation from "@/hooks/usePageNavigation";

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
  const { goTerms, goWithdrawal } = usePageNavigation();
  return (
    <View className="w-full px-4">
      <MyPageMenu title="이용약관" onPress={() => goTerms()} chevron={true} />
      <MyPageMenu title="로그아웃" onPress={handleLogout} chevron={true} />
      <MyPageMenu
        title="회원탈퇴"
        onPress={() => goWithdrawal()}
        chevron={true}
      />
    </View>
  );
}
