import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import KakaoLogin from "@/components/social/KakaoLogin";

export default function SocialLoginButtons() {
  return (
    <View className="mb-6 w-full space-y-3 p-4">
      <Pressable
        onPress={() => router.push("/login/apple")}
        className="flex-row items-center justify-center gap-2 rounded-xl bg-black px-6 py-4 shadow-md active:opacity-80"
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
      <View className="my-2" />
      <KakaoLogin />
    </View>
  );
}
