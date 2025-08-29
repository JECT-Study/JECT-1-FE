import { useCallback, useEffect, useState } from "react";

import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import {
  Alert,
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";

import MyMenus from "@/components/mypage/MyMenus";
import MyPageMenus from "@/components/mypage/MyPageMenus";
import UserInfo from "@/components/mypage/UserInfo";
import usePageNavigation from "@/hooks/usePageNavigation";

// 플랫폼별 토큰 조회 함수
async function getTokenAsync(key: string): Promise<string | null> {
  if (Platform.OS === "web") {
    return localStorage.getItem(key);
  } else {
    return await SecureStore.getItemAsync(key);
  }
}

export default function MyScreen() {
  const { goEditProfile } = usePageNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // 토큰 존재 여부로 로그인 상태 확인
  const checkLoginStatus = useCallback(async () => {
    try {
      const accessToken = await getTokenAsync("accessToken");
      const refreshToken = await getTokenAsync("refreshToken");

      console.log("🔍 MyScreen 토큰 확인:", {
        accessToken: !!accessToken,
        refreshToken: !!refreshToken,
        isLoggedIn: !!(accessToken && refreshToken),
      });

      setIsLoggedIn(!!(accessToken && refreshToken));
    } catch (error) {
      console.log("❌ MyScreen 토큰 확인 중 에러:", error);
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  // 프로필 수정 버튼 클릭 핸들러
  const handleEditProfile = () => {
    if (!isLoggedIn) {
      Alert.alert(
        "로그인이 필요합니다",
        "프로필을 수정하려면 먼저 로그인해주세요.",
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
    goEditProfile();
  };

  return (
    <SafeAreaView className="w-full flex-1 bg-white">
      <Text className="ml-6 mt-10 text-[18px]">마이페이지</Text>
      <UserInfo />
      <Pressable
        className="mx-6 mt-6 flex h-[32px] items-center justify-center rounded-[4px] bg-gray-100"
        onPress={handleEditProfile}
      >
        <Text className="text-[12px]">프로필 수정</Text>
      </Pressable>
      <MyMenus />
      <View
        aria-label="seperator"
        className="my-2 h-[12px] w-full bg-[#F2F2F7]"
      />
      <MyPageMenus />
    </SafeAreaView>
  );
}
