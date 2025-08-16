import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Platform, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AppleLogin from "@/components/login/AppleLogin";
import KakaoLogin from "@/components/login/KakaoLogin";
import TesterLogin from "@/components/login/TesterLogin";

export default function SocialLoginButtons() {
  const insets = useSafeAreaInsets();
  const isIOS = Platform.OS === "ios";
  return (
    <View className="w-full">
      <LinearGradient
        colors={["transparent", "black"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ height: 282, width: "100%" }}
        pointerEvents="none"
      />
      <View className="bg-[#010101]">
        <View className="w-full items-center">
          <KakaoLogin />
          <View className="my-2" />
          {isIOS ? <AppleLogin /> : null}
          {isIOS ? <View className="my-2" /> : null}
          <TesterLogin />
        </View>
        <Pressable
          onPress={() => router.push("/(tabs)")}
          className="mt-4 flex-row items-center justify-center"
        >
          <Text className="text-[13px] text-[#AAAAAA] underline">둘러보기</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push("/survey")}
          className="flex-row items-center justify-center"
        >
          <Text className="text-[13px] text-[#AAAAAA] underline">
            설문조사 시작하기
          </Text>
        </Pressable>
        <View className="m-4" />
        <View style={{ marginBottom: insets.bottom - 1 }} />
      </View>
    </View>
  );
}
