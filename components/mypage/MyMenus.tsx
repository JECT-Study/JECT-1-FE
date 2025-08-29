import { useCallback, useEffect, useState } from "react";

import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Alert, Platform, Pressable, Text, View } from "react-native";

import CalendarEditIcon from "@/components/icons/CalendarEditIcon";
import DiaryIcon from "@/components/icons/DiaryIcon";
import HeartIcon from "@/components/icons/HeartIcon";
import usePageNavigation from "@/hooks/usePageNavigation";

// 플랫폼별 토큰 조회 함수
async function getTokenAsync(key: string): Promise<string | null> {
  if (Platform.OS === "web") {
    return localStorage.getItem(key);
  } else {
    return await SecureStore.getItemAsync(key);
  }
}

export default function MyMenus() {
  const { goLike, goPlan, goSurvey } = usePageNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // 토큰 존재 여부로 로그인 상태 확인
  const checkLoginStatus = useCallback(async () => {
    try {
      const accessToken = await getTokenAsync("accessToken");
      const refreshToken = await getTokenAsync("refreshToken");
      setIsLoggedIn(!!(accessToken && refreshToken));
    } catch {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  // 나의일정 버튼 클릭 핸들러
  const handlePlan = () => {
    if (!isLoggedIn) {
      Alert.alert(
        "로그인이 필요합니다",
        "나의일정을 보려면 먼저 로그인해주세요.",
        [
          {
            text: "취소",
            style: "cancel",
          },
          {
            text: "로그인하러 가기",
            onPress: () => router.replace("/"),
          },
        ],
      );
      return;
    }
    goPlan();
  };

  // 관심목록 버튼 클릭 핸들러
  const handleLike = () => {
    if (!isLoggedIn) {
      Alert.alert(
        "로그인이 필요합니다",
        "관심목록을 보려면 먼저 로그인해주세요.",
        [
          {
            text: "취소",
            style: "cancel",
          },
          {
            text: "로그인하러 가기",
            onPress: () => router.replace("/"),
          },
        ],
      );
      return;
    }
    goLike();
  };

  // 취향 분석하기 버튼 클릭 핸들러
  const handleSurvey = () => {
    if (!isLoggedIn) {
      Alert.alert(
        "로그인이 필요합니다",
        "취향 분석을 하려면 먼저 로그인해주세요.",
        [
          {
            text: "취소",
            style: "cancel",
          },
          {
            text: "로그인하러 가기",
            onPress: () => router.replace("/"),
          },
        ],
      );
      return;
    }
    goSurvey();
  };

  return (
    <View className="mx-6 my-4 flex flex-row items-center justify-center rounded-md bg-[#F2F3F6]">
      <Pressable
        onPress={handlePlan}
        className="m-2 flex h-[70px] w-[105px] items-center justify-center"
      >
        <DiaryIcon />
        <Text className="m-[3.25px] text-[13px]">나의일정</Text>
      </Pressable>
      <View aria-label="seperator" className="h-[20px] w-[1px] bg-[#DDDFE6]" />
      <Pressable
        onPress={handleLike}
        className="m-2 flex h-[70px] w-[105px] items-center justify-center"
      >
        <HeartIcon size={24} />
        <Text className="m-[3.25px] text-[13px]">관심목록</Text>
      </Pressable>
      <View aria-label="seperator" className="h-[20px] w-[1px] bg-[#DDDFE6]" />
      <Pressable
        onPress={handleSurvey}
        className="m-2 flex h-[70px] w-[105px] items-center justify-center"
      >
        <CalendarEditIcon />
        <Text className="m-[3.25px] text-[13px]">취향 분석하기</Text>
      </Pressable>
    </View>
  );
}
