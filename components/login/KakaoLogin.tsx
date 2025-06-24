import { useEffect } from "react";

import { initializeKakaoSDK } from "@react-native-kakao/core";
import { login } from "@react-native-kakao/user";
import Constants from "expo-constants";
import { Pressable, Text } from "react-native";

import KakaoIcon from "@/components/icons/KakaoIcon";

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
      className="flex-row items-center justify-center gap-2 rounded-xl bg-yellow-300 px-6 py-4 active:opacity-80"
    >
      <KakaoIcon size={20} color="#3E1918" />
      <Text className="text-black">카카오톡으로 시작하기</Text>
    </Pressable>
  );
}
