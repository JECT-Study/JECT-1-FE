import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";

import { LoginUrl } from "@/constants/ApiUrls";
import { publicApi } from "@/features/axios/axiosInstance";
import useUserStore from "@/stores/useUserStore";

export const testerLogin = async () => {
  try {
    const response = await publicApi.post(LoginUrl, {
      socialId: "456",
      socialType: "KAKAO",
    });

    const { accessToken, refreshToken, nickname, image } = response.data.result;

    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("refreshToken", refreshToken);

    // 사용자 정보도 SecureStore에 저장
    await SecureStore.setItemAsync("nickname", nickname || "Tester");
    await SecureStore.setItemAsync("profileImage", image || "");

    // Store에 사용자 정보 저장
    const { setUserInfo } = useUserStore.getState().action;
    setUserInfo(nickname || "Tester", image || "");

    router.push("/(tabs)");
  } catch (error: any) {
    console.log("테스터 로그인 에러:", error?.response?.data?.message);

    // 2404 에러 코드인 경우 서버 메시지를 alert으로 표시
    if (error?.response?.data?.code === 2404) {
      const message =
        error.response?.data?.message || "미미 탈퇴한 사용자입니다.";
      Alert.alert("로그인 오류", message);
    }
    // 다른 에러의 경우는 기존처럼 조용히 처리 (애플 로그인 취소 등)
  }
};
