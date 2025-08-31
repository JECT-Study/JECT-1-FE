import { useCallback, useEffect, useState } from "react";

import { AxiosError } from "axios";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Alert, View } from "react-native";

import MyPageMenu from "@/components/mypage/MyPageMenu";
import usePageNavigation from "@/hooks/usePageNavigation";
import useUserStore from "@/stores/useUserStore";

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
            await SecureStore.deleteItemAsync("accessToken");
            await SecureStore.deleteItemAsync("refreshToken");

            // 사용자 정보도 SecureStore에서 제거
            await SecureStore.deleteItemAsync("nickname");
            await SecureStore.deleteItemAsync("profileImage");

            // 전역 상태 초기화
            const { clearUserInfo } = useUserStore.getState().action;
            clearUserInfo();

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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // 토큰 존재 여부로 로그인 상태 확인
  const checkLoginStatus = useCallback(async () => {
    try {
      const accessToken = await SecureStore.getItemAsync("accessToken");
      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      setIsLoggedIn(!!(accessToken && refreshToken));
    } catch (error) {
      console.error("토큰 확인 실패:", error);
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  return (
    <View className="w-full px-4">
      <MyPageMenu title="이용약관" onPress={() => goTerms()} chevron={true} />
      {isLoggedIn && (
        <>
          <MyPageMenu title="로그아웃" onPress={handleLogout} chevron={true} />
          <MyPageMenu
            title="회원탈퇴"
            onPress={() => goWithdrawal()}
            chevron={true}
          />
        </>
      )}
    </View>
  );
}
