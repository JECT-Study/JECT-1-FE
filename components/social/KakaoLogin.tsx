import { useEffect } from "react";

import { initializeKakaoSDK } from "@react-native-kakao/core";
import { login } from "@react-native-kakao/user";
import Constants from "expo-constants";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, Text } from "react-native";

export default function KakaoLogin() {
  const kakaoNativeAppKey =
    Constants.expoConfig?.extra?.kakaoNativeAppKey ?? "";
  useEffect(() => {
    initializeKakaoSDK(kakaoNativeAppKey);
  }, [kakaoNativeAppKey]);

  // TODO : 추후 로그인 기능 관련 논의 필요
  async function kakaoLogin() {
    try {
      const res = await login();
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Pressable
      onPress={kakaoLogin}
      className="flex-row items-center justify-center gap-2 rounded-xl bg-yellow-300 px-6 py-4 shadow-md active:opacity-80"
    >
      <Image
        source={require("@/assets/images/login/kakao_logo.png")}
        contentFit="contain"
        style={{ width: 24, height: 24 }}
      />
      <Text className="text-base font-semibold text-black">
        카카오톡으로 로그인하기
      </Text>
    </Pressable>
  );
}
