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
      socialId: "tester1",
      socialType: "APPLE",
    });

    const accessToken = response.data.result.accessToken;
    const refreshToken = response.data.result.refreshToken;
    const nickname = response.data.result.nickname;
    const image = response.data.result.image;

    console.log("🧪 테스터 로그인 성공 - 사용자 정보:", {
      nickname,
      image: image ? "있음" : "없음",
      accessToken: accessToken ? "있음" : "없음",
      refreshToken: refreshToken ? "있음" : "없음",
    });

    await setTokenAsync("accessToken", accessToken);
    await setTokenAsync("refreshToken", refreshToken);

    // Store에 사용자 정보 저장
    const { setUserInfo } = useUserStore.getState().action;
    setUserInfo(nickname || "Tester", image || "");

    console.log("💾 Store에 저장 완료:", {
      storedNickname: nickname || "Tester",
      storedImage: image || "",
      userStoreState: useUserStore.getState(),
    });

    router.push("/(tabs)");
  } catch (error) {
    console.log("테스터 로그인 에러:", error);
  }
}
