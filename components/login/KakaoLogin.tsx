import { useEffect } from "react";

import { initializeKakaoSDK } from "@react-native-kakao/core";
import { login, me } from "@react-native-kakao/user";
import axios, { AxiosError } from "axios";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { Pressable, Text } from "react-native";

import KakaoIcon from "@/components/icons/KakaoIcon";
import { LoginUrl } from "@/constants/ApiUrls";

export default function KakaoLogin() {
  const kakaoNativeAppKey =
    Constants.expoConfig?.extra?.kakaoNativeAppKey ?? "";

  useEffect(() => {
    initializeKakaoSDK(kakaoNativeAppKey);
  }, [kakaoNativeAppKey]);

  async function kakaoLogin() {
    try {
      await login();
      // const accessToken = res.accessToken;
      // const refreshToken = res.refreshToken;
    } catch (error) {
      alert("카카오 로그인 도중 에러가 발생했습니다.");
    } finally {
      const profile = await me();
      const id = profile.id;
      try {
        const response = await axios.post(LoginUrl, {
          socialId: id,
          socialType: "KAKAO",
        });
        const accessToken = response.data.result.accessToken;
        const refreshToken = response.data.result.refreshToken;
        await SecureStore.setItemAsync("accessToken", accessToken);
        await SecureStore.setItemAsync("refreshToken", refreshToken);
      } catch (error) {
        const axiosError = error as AxiosError;
        alert(
          `로그인 정보를 서버로 전송하던 도중 에러가 발생했습니다. ${axiosError.message}`,
        );
      }
      // finally {
      //   console.log("토큰저장확인");
      //   const storeAccessToken = await SecureStore.getItemAsync("accessToken");
      //   const storeRefreshToken =
      //     await SecureStore.getItemAsync("refreshToken");
      //   console.log(storeAccessToken, storeRefreshToken);
      // }
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
