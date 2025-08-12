import * as AppleAuthentication from "expo-apple-authentication";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

import { LoginUrl } from "@/constants/ApiUrls";
import { publicApi } from "@/features/axios/axiosInstance";
import useUserStore from "@/stores/useUserStore";

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
    console.log(response);
    const accessToken = response.data.result.accessToken;
    const refreshToken = response.data.result.refreshToken;
    const nickname = response.data.result.nickname;
    const image = response.data.result.image;

    console.log("🍎 애플 로그인 성공 - 사용자 정보:", {
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
    // 애플 로그인 취소 시에는 에러 메시지를 표시하지 않음
    console.log("애플 로그인 취소 또는 에러:", error);
  }
}

export async function AndroidAppleLogin() {
  console.log("Android Login");
}
