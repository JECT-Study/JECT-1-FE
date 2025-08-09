import * as AppleAuthentication from "expo-apple-authentication";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

import { LoginUrl } from "@/constants/ApiUrls";
import { publicApi } from "@/features/axios/axiosInstance";

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
    // 애플 로그인 취소 시에는 에러 메시지를 표시하지 않음
    console.log("애플 로그인 취소 또는 에러:", error);
  }
}

export async function AndroidAppleLogin() {
  console.log("Android Login");
}
