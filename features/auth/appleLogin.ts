import * as AppleAuthentication from "expo-apple-authentication";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import { LoginUrl } from "@/constants/ApiUrls";
import { publicApi } from "@/features/axios/axiosInstance";
import useUserStore from "@/stores/useUserStore";

// 플랫폼별 토큰 저장 함수
async function setTokenAsync(key: string, value: string) {
  if (Platform.OS === "web") {
    localStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

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
    const nickname = response.data.result.nickname;
    const image = response.data.result.image;

    await setTokenAsync("accessToken", accessToken);
    await setTokenAsync("refreshToken", refreshToken);

    // Store에 사용자 정보 저장
    const { setUserInfo } = useUserStore.getState().action;
    setUserInfo(nickname || "", image || "");

    router.push("/(tabs)");
  } catch {
    // 애플 로그인 취소 시에는 에러 메시지를 표시하지 않음
  }
}

export async function AndroidAppleLogin() {
  // console.log("Android Login");
}
