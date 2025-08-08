import { useEffect } from "react";

import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { View, Text } from "react-native";

import LoginCardSlider from "@/components/login/LoginCardSlider";
import SocialLoginButtons from "@/components/login/SocialLoginButtons";

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    const getStoreTokens = async () => {
      const storeAccessToken = await SecureStore.getItemAsync("accessToken");
      const storeRefreshToken = await SecureStore.getItemAsync("refreshToken");
      if (storeAccessToken && storeRefreshToken) {
        router.replace("/(tabs)");
      }
    };
    getStoreTokens();
    console.log("useEffect");
  });

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
