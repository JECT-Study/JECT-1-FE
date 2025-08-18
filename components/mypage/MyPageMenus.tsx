import { AxiosError } from "axios";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Alert, Platform, View } from "react-native";

import MyPageMenu from "@/components/mypage/MyPageMenu";
import usePageNavigation from "@/hooks/usePageNavigation";

// 플랫폼별 토큰 삭제 함수
async function deleteTokenAsync(key: string) {
  if (Platform.OS === "web") {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
}

const handleLogout = async () => {
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
        onPress: async () => {
          try {
            // await authApi.post(LogoutUrl);
            await deleteTokenAsync("accessToken");
            await deleteTokenAsync("refreshToken");
            alert("로그아웃이 완료되었습니다.");

            router.dismissAll();
            // dismissAll 완료 후 잠시 대기
            setTimeout(() => {
              router.push("/");
              router.dismissAll(); // 이전 기록들 정리
            }, 100);
          } catch (error) {
            const axiosError = error as AxiosError;
            alert(`로그아웃 도중 에러가 발생했습니다. ${axiosError.message}`);
          }
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
