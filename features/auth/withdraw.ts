import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import { WithdrawUrl } from "@/constants/ApiUrls";
import { authApi } from "@/features/axios/axiosInstance";
import useUserStore from "@/stores/useUserStore";

// 플랫폼별 토큰 삭제 함수
async function deleteTokenAsync(key: string) {
  if (Platform.OS === "web") {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
}

export async function withdraw() {
  try {
    await authApi.delete(WithdrawUrl);

    console.log("회원탈퇴 성공");

    // 토큰 삭제
    await deleteTokenAsync("accessToken");
    await deleteTokenAsync("refreshToken");

    // Store 초기화
    const { clearUserInfo } = useUserStore.getState().action;
    clearUserInfo();

    // 로그인 화면으로 이동
    router.replace("/");
  } catch (error) {
    console.log("회원탈퇴 에러:", error);
    throw error;
  }
}
