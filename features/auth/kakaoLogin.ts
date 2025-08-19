import { initializeKakaoSDK } from "@react-native-kakao/core";
import { login, me } from "@react-native-kakao/user";
import Constants from "expo-constants";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import { LoginUrl } from "@/constants/ApiUrls";
import { publicApi } from "@/features/axios/axiosInstance";
import useUserStore from "@/stores/useUserStore";

const kakaoNativeAppKey = Constants.expoConfig?.extra?.kakaoNativeAppKey ?? "";
const kakaoWebAppKey = Constants.expoConfig?.extra?.kakaoWebAppKey ?? "";

// 플랫폼별 토큰 저장 함수
async function setTokenAsync(key: string, value: string) {
  if (Platform.OS === "web") {
    localStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

// SDK 초기화 함수
export function initializeKakao() {
  // 웹 환경에서는 카카오 SDK 초기화를 건너뜀
  if (Platform.OS === "web") {
    return;
  }

  const appKey = kakaoNativeAppKey;
  if (!appKey) {
    console.error("카카오 앱 키가 설정되지 않았습니다.");
    return;
  }

  initializeKakaoSDK(appKey);
}

// 카카오 로그인 함수
export async function kakaoLogin() {
  // 웹 환경에서는 카카오 로그인을 지원하지 않음
  if (Platform.OS === "web") {
    alert(
      "웹 환경에서는 카카오 로그인이 지원되지 않습니다. 테스터 로그인을 이용해주세요.",
    );
    return;
  }

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
    const nickname = response.data.result.nickname;
    const image = response.data.result.image;

    await setTokenAsync("accessToken", accessToken);
    await setTokenAsync("refreshToken", refreshToken);

    // Store에 사용자 정보 저장
    const { setUserInfo } = useUserStore.getState().action;
    setUserInfo(nickname || "", image || "");

    router.push("/(tabs)");
  } catch {
    // 카카오 로그인 취소 시에는 에러 메시지를 표시하지 않음
  }
}
