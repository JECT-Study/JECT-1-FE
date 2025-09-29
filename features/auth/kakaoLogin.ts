import { initializeKakaoSDK } from "@react-native-kakao/core";
import { login, me } from "@react-native-kakao/user";
import Constants from "expo-constants";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";

import { LoginUrl } from "@/constants/ApiUrls";
import { publicApi } from "@/features/axios/axiosInstance";
import useUserStore from "@/stores/useUserStore";

const kakaoNativeAppKey = Constants.expoConfig?.extra?.kakaoNativeAppKey ?? "";

// SDK 초기화 함수
export const initializeKakao = () => {
  const appKey = kakaoNativeAppKey;
  if (!appKey) {
    console.error("카카오 앱 키가 설정되지 않았습니다.");
    return;
  }

  initializeKakaoSDK(appKey);
};

// 카카오 로그인 함수
export const kakaoLogin = async () => {
  try {
    try {
      // 먼저 카카오톡 로그인 시도
      await login();
    } catch (kakaoError: any) {
      // 카카오톡이 설치되어 있지만 로그인이 안 되어 있는 경우 웹뷰로 재시도
      if (kakaoError.message?.includes("not connected to Kakao account")) {
        console.log("카카오톡 로그인 실패, 웹뷰로 재시도");
        await login({
          useKakaoAccountLogin: true, // 웹뷰로 로그인
        });
      } else {
        throw kakaoError; // 다른 에러는 그대로 throw
      }
    }

    const profile = await me();
    const id = profile.id;

    const response = await publicApi.post(LoginUrl, {
      socialId: id,
      socialType: "KAKAO",
    });

    const { accessToken, refreshToken, nickname, image } = response.data.result;

    console.log("📝 카카오 로그인 성공 - 사용자 정보:", {
      nickname,
      image: image ? "있음" : "없음",
      accessToken: accessToken ? "있음" : "없음",
      refreshToken: refreshToken ? "있음" : "없음",
    });

    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("refreshToken", refreshToken);

    // 사용자 정보도 SecureStore에 저장
    await SecureStore.setItemAsync("nickname", nickname || "");
    await SecureStore.setItemAsync("profileImage", image || "");

    // Store에 사용자 정보 저장
    const { setUserInfo } = useUserStore.getState().action;
    setUserInfo(nickname || "", image || "");

    router.push("/(tabs)");
  } catch (error: any) {
    // 카카오 로그인 취소 시에는 에러 메시지를 표시하지 않음

    console.log("카카오 로그인 취소 또는 에러:", error);

    // 2404 에러 코드인 경우 서버 메시지를 alert으로 표시
    if (error?.response?.data?.code === 2404) {
      const message =
        error.response?.data?.message || "미미 탈퇴한 사용자입니다.";
      Alert.alert("로그인 오류", message);
    }
  }
};
