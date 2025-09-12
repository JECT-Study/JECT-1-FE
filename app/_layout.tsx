import "@/global.css";
import { useEffect } from "react";

import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import dayjs from "dayjs";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import "react-native-reanimated";

import { BACKEND_URL } from "@/constants/ApiUrls";
import { authApi, publicApi } from "@/features/axios/axiosInstance";
import { useColorScheme } from "@/hooks/useColorScheme";
import useDataStore from "@/stores/useDataStore";

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const {
    allDataLoaded,
    setLoading,
    setAllDataLoaded,
    setCurrentDate,
    setHomeData,
    setScheduleData,
    setUserInfo,
  } = useDataStore();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // 데이터 프리로딩
  useEffect(() => {
    if (!loaded) return;

    const preloadAllData = async () => {
      try {
        setLoading(true);

        // 0. 현재 날짜 설정
        const today = dayjs().format("YYYY-MM-DD");
        setCurrentDate(today);

        // 1. 홈탭 데이터 병렬 로딩
        const homeDataPromises = Promise.all([
          // 맞춤 콘텐츠 (PERFORMANCE 기본)
          authApi.get(
            `${BACKEND_URL}/home/recommendations?category=PERFORMANCE`,
          ),
          // 핫한 축제
          publicApi.get(`${BACKEND_URL}/home/festival/hot`),
          // 주간 콘텐츠 (오늘)
          publicApi.get(`${BACKEND_URL}/home/contents/week?date=${today}`),
          // 카테고리 콘텐츠
          publicApi.get(`${BACKEND_URL}/home/category?category=PERFORMANCE`),
        ]);

        // 2. 스케줄 데이터 로딩 (fetchScheduleData와 동일한 로직)
        const schedulePromise = (async () => {
          try {
            const response = await publicApi.get(`${BACKEND_URL}/schedules`, {
              params: {
                page: 0,
                limit: 8,
                day: today,
              },
            });

            if (response.data.isSuccess && response.data.result) {
              const { content } = response.data.result;
              // thumbnailUrl을 image로 매핑
              return content.map((item: any) => ({
                ...item,
                image: item.thumbnailUrl || "",
              }));
            } else {
              return [];
            }
          } catch (error) {
            console.error("스케줄 데이터 로딩 실패:", error);
            return [];
          }
        })();

        // 3. 사용자 정보 확인
        const userInfoPromise = (async () => {
          try {
            const accessToken = await SecureStore.getItemAsync("accessToken");
            const refreshToken = await SecureStore.getItemAsync("refreshToken");

            if (accessToken && refreshToken) {
              const nickname =
                (await SecureStore.getItemAsync("nickname")) || "";
              const profileImage =
                (await SecureStore.getItemAsync("profileImage")) || "";
              return { isLoggedIn: true, nickname, profileImage };
            } else {
              return { isLoggedIn: false, nickname: "", profileImage: "" };
            }
          } catch (error) {
            console.log("❌ 사용자 정보 확인 중 에러:", error);
            return { isLoggedIn: false, nickname: "", profileImage: "" };
          }
        })();

        // 모든 데이터 병렬 로딩
        const [homeResults, scheduleContent, userInfo] = await Promise.all([
          homeDataPromises,
          schedulePromise,
          userInfoPromise,
        ]);

        // 홈 데이터 저장
        const [recommendationsRes, hotFestivalRes, weeklyRes, categoryRes] =
          homeResults;
        setHomeData({
          recommendations: recommendationsRes.data.isSuccess
            ? recommendationsRes.data.result
            : [],
          hotFestival: hotFestivalRes.data.isSuccess
            ? hotFestivalRes.data.result
            : [],
          weeklyContent: weeklyRes.data.isSuccess ? weeklyRes.data.result : [],
          categoryContent: categoryRes.data.isSuccess
            ? categoryRes.data.result
            : [],
        });

        // 스케줄 데이터 저장 (이미 처리됨)
        setScheduleData(scheduleContent);

        // 사용자 정보 저장
        setUserInfo(userInfo);

        // 모든 데이터 로딩 완료
        setAllDataLoaded(true);

        console.log("✅ 모든 데이터 프리로딩 완료");
      } catch (error) {
        console.error("❌ 데이터 프리로딩 실패:", error);
        // 에러가 발생해도 앱을 시작할 수 있도록 완료 처리
        setAllDataLoaded(true);
      } finally {
        setLoading(false);
      }
    };

    preloadAllData();
  }, [
    loaded,
    setLoading,
    setAllDataLoaded,
    setCurrentDate,
    setHomeData,
    setScheduleData,
    setUserInfo,
  ]);

  // 폰트 + 데이터 로딩 완료 시 스플래시 숨김
  useEffect(() => {
    if (loaded && allDataLoaded) {
      SplashScreen.hideAsync();
      console.log("✅ 스플래시 스크린 숨김");
    }
  }, [loaded, allDataLoaded]);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  console.log("All data loaded:", allDataLoaded);

  return (
    <GestureHandlerRootView>
      <ActionSheetProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <StatusBar style="light" />
          <View
            style={{
              flex: 1,
              alignItems: "center",
              backgroundColor: "#010101",
            }}
          >
            <View
              style={{
                width: "100%",
                maxWidth: "100%",
                flex: 1,
              }}
            >
              <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen
                  name="survey/index"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="(tabs)"
                  options={{ headerShown: false, gestureEnabled: false }}
                />
                <Stack.Screen name="+not-found" />
                <Stack.Screen
                  name="my/withdrawal"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="my/terms/service_terms"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="my/terms/service_privacy"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="my/terms/service_location"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="search-keywords/index"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="search-results/index"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="detail/[id]"
                  options={{
                    headerShown: false,
                    presentation: "card",
                  }}
                />
                <Stack.Screen
                  name="edit-profile/index"
                  options={{
                    headerShown: false,
                    presentation: "card",
                  }}
                />
                <Stack.Screen
                  name="plan/index"
                  options={{
                    headerShown: false,
                    presentation: "card",
                  }}
                />
                <Stack.Screen
                  name="like/index"
                  options={{
                    headerShown: false,
                    presentation: "card",
                  }}
                />
                <Stack.Screen
                  name="terms/index"
                  options={{
                    headerShown: false,
                    presentation: "card",
                  }}
                />
                <Stack.Screen
                  name="image-viewer/index"
                  options={{
                    headerShown: false,
                    presentation: "card",
                  }}
                />
              </Stack>
            </View>
          </View>
        </ThemeProvider>
      </ActionSheetProvider>
    </GestureHandlerRootView>
  );
}

// let AppEntryPoint = RootLayout;
