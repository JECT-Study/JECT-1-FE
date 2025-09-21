import "@/global.css";
import { useEffect } from "react";

import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as Linking from "expo-linking";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

SplashScreen.setOptions({
  duration: 2000,
  fade: true,
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    const handleDeepLink = async (url: string) => {
      console.log("🔗 딥링크 수신:", url);
      const parsed = Linking.parse(url);
      console.log("🔍 파싱된 URL:", parsed);

      // 카카오 딥링크 처리: kakao[앱키]://kakaolink?target=detail&id=123
      if (parsed.hostname === "kakaolink" && parsed.queryParams) {
        const { target, id } = parsed.queryParams;
        console.log("🎯 카카오 딥링크 - target:", target, "id:", id);

        if (target === "detail" && id) {
          console.log("📍 detail 페이지로 이동:", `/detail/${id}`);
          router.push(`/detail/${id}`);
        }
      }
      // mycode://detail/123 형태의 일반 딥링크 처리
      else if (parsed.hostname === "detail" && parsed.path) {
        const contentId = parsed.path.replace("/", "");
        console.log("📍 추출된 contentId:", contentId);
        if (contentId) {
          router.push(`/detail/${contentId}`);
        }
      }
    };

    // 앱이 이미 실행 중일 때 딥링크 처리
    const subscription = Linking.addEventListener("url", (event) => {
      handleDeepLink(event.url);
    });

    // 앱이 종료된 상태에서 딥링크로 실행될 때 처리
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });

    return () => subscription?.remove();
  }, [router]);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

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
