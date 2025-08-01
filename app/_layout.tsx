import "@/global.css";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import Constants from "expo-constants";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

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
          <View
            style={{
              flex: 1,
              alignItems: "center",
              backgroundColor: "#010101",
            }}
          >
            <View
              style={{
                width: 500,
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
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
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
              </Stack>
            </View>
          </View>
          <StatusBar style="auto" />
        </ThemeProvider>
      </ActionSheetProvider>
    </GestureHandlerRootView>
  );
}

// let AppEntryPoint = RootLayout;
