import { useCallback, useEffect, useState } from "react";

import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Alert, Platform, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AppleLogin from "@/components/login/AppleLogin";
import KakaoLogin from "@/components/login/KakaoLogin";
import TesterLogin from "@/components/login/TesterLogin";

// 플랫폼별 토큰 조회 함수
async function getTokenAsync(key: string): Promise<string | null> {
  if (Platform.OS === "web") {
    return localStorage.getItem(key);
  } else {
    return await SecureStore.getItemAsync(key);
  }
}

export default function SocialLoginButtons() {
  const insets = useSafeAreaInsets();
  const isIOS = Platform.OS === "ios";
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // 웹과 모바일 모두에서 일관된 동작을 위해 두 hook 모두 사용
  const checkTokens = useCallback(async () => {
    try {
      const accessToken = await getTokenAsync("accessToken");
      const refreshToken = await getTokenAsync("refreshToken");
      setIsLoggedIn(!!(accessToken && refreshToken));
    } catch (error) {
      console.error("토큰 확인 실패:", error);
      setIsLoggedIn(false);
    }
  }, []);

  // 컴포넌트 마운트 시 실행 (웹 환경 호환성)
  useEffect(() => {
    checkTokens();
  }, [checkTokens]);

  // 화면 포커스 시 실행 (모바일 환경 최적화)
  useFocusEffect(
    useCallback(() => {
      checkTokens();
    }, [checkTokens]),
  );

  return (
    <View className="w-full">
      <LinearGradient
        colors={["transparent", "black"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ height: 282, width: "100%" }}
        pointerEvents="none"
      />
      <View className="bg-[#010101] px-4">
        <View className="mb-6 w-full items-center">
          <KakaoLogin disabled={isLoggedIn} />
          <View className="my-2" />
          {isIOS ? <AppleLogin disabled={isLoggedIn} /> : null}
          {isIOS ? <View className="my-2" /> : null}
          <TesterLogin disabled={isLoggedIn} />
        </View>

        <View className="flex-col items-center justify-center gap-y-4">
          <Pressable
            onPress={() => router.push("/(tabs)")}
            className="flex-row items-center justify-center px-6"
          >
            <Text className="text-[16px] text-[#AAAAAA] underline underline-offset-4">
              둘러보기
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              if (!isLoggedIn) {
                Alert.alert(
                  "로그인이 필요합니다",
                  "로그인 후 설문조사를 시작해주세요.",
                );
                return;
              }
              router.push("/survey");
            }}
            className="flex-row items-center justify-center px-6"
          >
            <Text className="text-[16px] text-[#AAAAAA] underline underline-offset-4">
              설문조사 시작하기
            </Text>
          </Pressable>
        </View>
        <View className="m-4" />
        <View style={{ marginBottom: insets.bottom - 1 }} />
      </View>
    </View>
  );
}
