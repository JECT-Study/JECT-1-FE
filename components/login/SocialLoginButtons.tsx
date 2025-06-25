import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AppleLogin from "@/components/login/AppleLogin";
import KakaoLogin from "@/components/login/KakaoLogin";

export default function SocialLoginButtons() {
  const insets = useSafeAreaInsets();
  return (
    <View className="w-full">
      <LinearGradient
        colors={["transparent", "black"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ height: 282, width: "100%" }}
        pointerEvents="none"
      />
      <View className="bg-black">
        <KakaoLogin />
        <View className="m-2" />
        <AppleLogin />
        <View className="m-4" />
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
