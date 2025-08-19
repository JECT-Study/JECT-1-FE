import "@/global.css";
import { useEffect } from "react";

import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import Head from "expo-router/head";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <>
      <Head>
        {/* 기본 메타데이터 */}
        <title>MyCODE</title>
        <meta
          name="description"
          content="내 코드에 딱 맞는 문화생활, 마이코드에서"
        />

        {/* Open Graph 메타데이터 */}
        <meta property="og:title" content="MyCODE" />
        <meta
          property="og:description"
          content="내 코드에 딱 맞는 문화생활, 마이코드에서"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mycode.expo.app" />
        <meta
          property="og:image"
          content="https://mfnmcpsoimdf9o2j.public.blob.vercel-storage.com/og-image.png"
        />
        <meta property="og:site_name" content="MyCODE" />

        {/* Twitter Card 메타데이터 */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MyCODE" />
        <meta
          name="twitter:description"
          content="내 코드에 딱 맞는 문화생활, 마이코드에서"
        />
        <meta
          name="twitter:image"
          content="https://mfnmcpsoimdf9o2j.public.blob.vercel-storage.com/og-image.png"
        />

        {/* 추가 메타데이터 */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#010101" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
                  width: 400,
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
                    options={{ headerShown: false }}
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
                    name="search/index"
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
    </>
  );
}

// let AppEntryPoint = RootLayout;
