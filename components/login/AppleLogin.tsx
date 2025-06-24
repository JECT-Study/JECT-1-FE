import { Image } from "expo-image";
import { Platform, Pressable, Text } from "react-native";

import { IOSAppleLogin, AndroidAppleLogin } from "@/features/auth/appleLogin";

export default function AppleLogin() {
  const handlePress =
    Platform.OS === "android" ? AndroidAppleLogin : IOSAppleLogin;
  return (
    <Pressable
      onPress={handlePress}
      className="flex-row items-center justify-center gap-2 rounded-xl bg-black px-6 py-4 active:opacity-80"
    >
      <Image
        source={require("@/assets/images/login/apple_logo.png")}
        contentFit="contain"
        style={{ width: 24, height: 24 }}
      />
      <Text className="text-base font-semibold text-white">
        Apple 계정으로 로그인하기
      </Text>
    </Pressable>
  );
}
