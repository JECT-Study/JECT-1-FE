import { useEffect } from "react";

import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { View, Text } from "react-native";

import LoginCardSlider from "@/components/login/LoginCardSlider";
import SocialLoginButtons from "@/components/login/SocialLoginButtons";

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    const checkTokens = async () => {
      console.log("토큰 확인 - useEffect 실행됨");
      const storeAccessToken = await SecureStore.getItemAsync("accessToken");
      const storeRefreshToken = await SecureStore.getItemAsync("refreshToken");
      console.log("토큰 상태:", { storeAccessToken, storeRefreshToken });
      if (storeAccessToken && storeRefreshToken) {
        console.log("토큰 존재 - 탭으로 이동");
        router.replace("/(tabs)");
      } else {
        console.log("토큰 없음 - 로그인 화면 유지");
      }
    };

    checkTokens();
  }); // 의존성 배열 없음 - 매 렌더링마다 실행

  return (
    <View className="flex-1 items-center bg-black">
      <LoginCardSlider />
      <View className="items-center">
        <Text className="text-[34px] font-semibold text-white">마이코드</Text>
        <Text className="text-[18px] text-white">
          나에게 맞는 컨텐츠를 한눈에
        </Text>
      </View>
      <SocialLoginButtons />
    </View>
  );
}
