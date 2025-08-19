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

export async function testerLogin() {
  try {
    const response = await publicApi.post(LoginUrl, {
      socialId: "123",
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
    setUserInfo(nickname || "Tester", image || "");

    router.push("/(tabs)");
  } catch {
    // console.log("테스터 로그인 에러:", error);
  }
}
