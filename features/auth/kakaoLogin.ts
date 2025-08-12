import { initializeKakaoSDK } from "@react-native-kakao/core";
import { login, me } from "@react-native-kakao/user";
import Constants from "expo-constants";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

import { LoginUrl } from "@/constants/ApiUrls";
import { publicApi } from "@/features/axios/axiosInstance";
import useUserStore from "@/stores/useUserStore";

const kakaoNativeAppKey = Constants.expoConfig?.extra?.kakaoNativeAppKey ?? "";

// SDK 초기화 함수
export function initializeKakao() {
  initializeKakaoSDK(kakaoNativeAppKey);
}

// 카카오 로그인 함수
export async function kakaoLogin() {
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

    console.log("📝 카카오 로그인 성공 - 사용자 정보:", {
      nickname,
      image: image ? "있음" : "없음",
      accessToken: accessToken ? "있음" : "없음",
      refreshToken: refreshToken ? "있음" : "없음"
    });

    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("refreshToken", refreshToken);

    // Store에 사용자 정보 저장
    const { setUserInfo } = useUserStore.getState().action;
    setUserInfo(nickname || "", image || "");

    console.log("💾 Store에 저장 완료:", {
      storedNickname: nickname || "",
      storedImage: image || "",
      userStoreState: useUserStore.getState()
    });

    router.push("/(tabs)");
  } catch (error) {
    // 카카오 로그인 취소 시에는 에러 메시지를 표시하지 않음
    console.log("카카오 로그인 취소 또는 에러:", error);
  }
}
