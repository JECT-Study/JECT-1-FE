import { useEffect } from "react";

import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Platform, Text, View } from "react-native";

import LoginCardSlider from "@/components/login/LoginCardSlider";
import SocialLoginButtons from "@/components/login/SocialLoginButtons";

// 플랫폼별 토큰 조회 함수
async function getTokenAsync(key: string): Promise<string | null> {
  if (Platform.OS === "web") {
    return localStorage.getItem(key);
  } else {
    return await SecureStore.getItemAsync(key);
  }
}

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    const checkTokens = async () => {
      const storeAccessToken = await getTokenAsync("accessToken");
      const storeRefreshToken = await getTokenAsync("refreshToken");
      console.log("토큰 상태:", { storeAccessToken, storeRefreshToken });
      if (storeAccessToken && storeRefreshToken) {
        router.replace("/(tabs)");
      } else {
        console.log("토큰 없음 - 로그인 화면 유지");
      }
    };

    checkTokens();
  }, [router]); // router 의존성 추가

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
