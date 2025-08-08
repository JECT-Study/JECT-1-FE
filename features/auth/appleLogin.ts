import { AxiosError } from "axios";
import * as AppleAuthentication from "expo-apple-authentication";
import * as SecureStore from "expo-secure-store";

import { LoginUrl } from "@/constants/ApiUrls";
import { publicApi } from "@/features/axios/axiosInstance";
import { router } from "expo-router";

export async function IOSAppleLogin() {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
    const id = credential.user;
    const response = await publicApi.post(LoginUrl, {
      socialId: id,
      socialType: "APPLE",
    });
    const accessToken = response.data.result.accessToken;
    const refreshToken = response.data.result.refreshToken;
    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("refreshToken", refreshToken);
    router.replace("/(tabs)");
  } catch (error) {
    const axiosError = error as AxiosError;
    alert(`애플 로그인 도중 서버 에러가 발생했습니다. ${axiosError.message}`);
  }
}

export async function AndroidAppleLogin() {
  console.log("Android Login");
}
