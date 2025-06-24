import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

import AppleLogin from "@/components/login/AppleLogin";
import KakaoLogin from "@/components/login/KakaoLogin";

export default function SocialLoginButtons() {
  return (
    <View className="w-full gap-3 bg-white py-20">
      <AppleLogin />
      <KakaoLogin />
      <Pressable
        onPress={() => router.push("/(tabs)")}
        className="mt-4 flex-row items-center justify-center"
      >
        <Text className="text-lg text-black">둘러보기</Text>
      </Pressable>
      <Pressable
        onPress={() => router.push("/survey")}
        className="flex-row items-center justify-center"
      >
        <Text className="text-lg text-black">설문조사 시작하기</Text>
      </Pressable>
    </View>
  );
}
