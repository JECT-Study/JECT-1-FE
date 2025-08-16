import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

import { WithdrawUrl } from "@/constants/ApiUrls";
import { authApi } from "@/features/axios/axiosInstance";
import useUserStore from "@/stores/useUserStore";

export async function withdraw() {
  try {
    await authApi.delete(WithdrawUrl);

    console.log("회원탈퇴 성공");

    // 토큰 삭제
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");

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
