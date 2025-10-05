import * as AppleAuthentication from "expo-apple-authentication";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";

import { LoginUrl } from "@/constants/ApiUrls";
import { publicApi } from "@/features/axios/axiosInstance";
import useUserStore from "@/stores/useUserStore";

export const IOSAppleLogin = async () => {
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

    const { accessToken, refreshToken, nickname, image, userRegions } =
      response.data.result;

    console.log("애플 로그인", response.data.result);

    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("refreshToken", refreshToken);

    // 사용자 정보도 SecureStore에 저장
    await SecureStore.setItemAsync("nickname", nickname || "");
    await SecureStore.setItemAsync("profileImage", image || "");
    await SecureStore.setItemAsync(
      "userRegions",
      JSON.stringify(userRegions || []),
    );

    // Store에 사용자 정보 저장
    const { setUserInfo } = useUserStore.getState().action;
    setUserInfo(nickname || "", image || "", userRegions || []);

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
};

export const AndroidAppleLogin = () => {
  console.log("Android Login");
};
