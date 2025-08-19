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
  // 웹 환경에서는 브라우저 기본 confirm 사용
  if (Platform.OS === "web") {
    const confirmed = window.confirm("정말 로그아웃 하시겠어요?");
    if (confirmed) {
      try {
        await deleteTokenAsync("accessToken");
        await deleteTokenAsync("refreshToken");
        alert("로그아웃이 완료되었습니다.");
        router.replace("/");
        // 웹에서 로그아웃 후 약간의 지연 후 새로고침으로 상태 완전 초기화
        setTimeout(() => window.location.reload());
      } catch (error) {
        const axiosError = error as AxiosError;
        alert(`로그아웃 도중 에러가 발생했습니다. ${axiosError.message}`);
      }
    }
  } else {
    // 모바일 환경에서는 React Native Alert 사용
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
              setTimeout(() => {
                router.push("/");
                router.dismissAll();
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
  }
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
