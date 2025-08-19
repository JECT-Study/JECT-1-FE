import { useEffect, useState } from "react";

import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Platform, Pressable, SafeAreaView, Text, View } from "react-native";

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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const accessToken = await getTokenAsync("accessToken");
        const refreshToken = await getTokenAsync("refreshToken");
        setIsLoggedIn(!!(accessToken && refreshToken));
      } catch (error) {
        console.error("로그인 상태 확인 중 에러:", error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  // 로그인 상태 확인 중 로딩 표시
  if (isLoggedIn === null) {
    return (
      <SafeAreaView className="w-full flex-1 bg-white">
        <Text className="ml-6 mt-10 text-[18px]">마이페이지</Text>
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">로딩 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // 로그인되지 않은 경우
  if (!isLoggedIn) {
    return (
      <SafeAreaView className="w-full flex-1 bg-white">
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-[16px] text-gray-600">
            로그인이 필요합니다
          </Text>
          <Text className="mt-2 text-center text-[14px] text-gray-400">
            마이페이지를 이용하려면 로그인해주세요
          </Text>
          <Pressable
            className="mt-6 flex h-[48px] w-full items-center justify-center rounded-[8px] bg-black"
            onPress={() => {
              router.replace("/");
              setTimeout(() => window.location.reload());
            }}
          >
            <Text className="text-[16px] font-semibold text-white">
              로그인하기
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // 로그인된 경우 기존 UI 표시
  return (
    <SafeAreaView className="w-full flex-1 bg-white">
      <Text className="ml-6 mt-10 text-[18px]">마이페이지</Text>
      <UserInfo />
      <Pressable
        className="mx-6 mt-6 flex h-[32px] items-center justify-center rounded-[4px] bg-gray-100"
        onPress={() => goEditProfile()}
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
