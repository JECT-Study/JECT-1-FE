import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

import KakaoLogin from "@/components/login/KakaoLogin";

export default function SocialLoginButtons() {
  return (
    <View className="w-full gap-3 bg-white py-20">
      <Pressable
        onPress={() => router.push("/login/apple")}
        className="flex-row items-center justify-center gap-2 rounded-xl bg-black px-6 py-4 active:opacity-80"
      >
        <Image
          source={require("@/assets/images/login/apple_logo.png")} // 이미지 교체 예정
          contentFit="contain"
          style={{ width: 24, height: 24 }}
        />
        <Text className="text-base font-semibold text-white">
          Apple 계정으로 로그인하기(미완)
        </Text>
      </Pressable>
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
