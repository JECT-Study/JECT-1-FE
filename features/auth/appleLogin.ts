import * as AppleAuthentication from "expo-apple-authentication";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Alert, Platform } from "react-native";

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

    const { accessToken, refreshToken, nickname, image } = response.data.result;

    console.log("🍎 애플 로그인 성공 - 사용자 정보:", {
      nickname,
      image: image ? "있음" : "없음",
      accessToken: accessToken ? "있음" : "없음",
      refreshToken: refreshToken ? "있음" : "없음",
    });

    await setTokenAsync("accessToken", accessToken);
    await setTokenAsync("refreshToken", refreshToken);

    // Store에 사용자 정보 저장
    const { setUserInfo } = useUserStore.getState().action;
    setUserInfo(nickname || "", image || "");

    console.log("💾 Store에 저장 완료:", {
      storedNickname: nickname || "",
      storedImage: image || "",
      userStoreState: useUserStore.getState(),
    });

    router.push("/(tabs)");
  } catch (error: any) {
    console.log("애플 로그인 취소 또는 에러:", error?.response?.data?.message);

    // 2404 에러 코드인 경우 서버 메시지를 alert으로 표시
    if (error?.response?.data?.code === 2404) {
      const message =
        error.response?.data?.message || "미미 탈퇴한 사용자입니다.";
      Alert.alert("로그인 오류", message);
    }
    // 다른 에러의 경우는 기존처럼 조용히 처리 (애플 로그인 취소 등)
  }
}

export async function AndroidAppleLogin() {
  console.log("Android Login");
}
