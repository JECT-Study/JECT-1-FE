import { useEffect } from "react";

import { initializeKakaoSDK } from "@react-native-kakao/core";
import { login, me } from "@react-native-kakao/user";
import Constants from "expo-constants";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Pressable, Text } from "react-native";

import KakaoIcon from "@/components/icons/KakaoIcon";
import { LoginUrl } from "@/constants/ApiUrls";
import { publicApi } from "@/features/axios/axiosInstance";

export default function KakaoLogin() {
  const kakaoNativeAppKey =
    Constants.expoConfig?.extra?.kakaoNativeAppKey ?? "";

  useEffect(() => {
    initializeKakaoSDK(kakaoNativeAppKey);
  }, [kakaoNativeAppKey]);

  async function kakaoLogin() {
    try {
      await login();
      const profile = await me();
      const id = profile.id;

      const response = await publicApi.post(LoginUrl, {
        socialId: id,
        socialType: "KAKAO",
      });
      const accessToken = response.data.result.accessToken;
      const refreshToken = response.data.result.refreshToken;
      await SecureStore.setItemAsync("accessToken", accessToken);
      await SecureStore.setItemAsync("refreshToken", refreshToken);
      router.push("/(tabs)");
    } catch (error) {
      // 카카오 로그인 취소 시에는 에러 메시지를 표시하지 않음
      console.log("카카오 로그인 취소 또는 에러:", error);
    }
  }

  return (
    <Pressable
      onPress={kakaoLogin}
      className="mx-auto w-full max-w-[500px] flex-row items-center justify-center gap-2 rounded-xl bg-yellow-300 px-6 py-4 active:opacity-80"
    >
      <KakaoIcon size={20} color="#3E1918" />
      <Text className="text-black">카카오톡으로 시작하기</Text>
    </Pressable>
  );
}
