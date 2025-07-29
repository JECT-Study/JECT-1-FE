import { Platform, Pressable, Text } from "react-native";

import AppleIcon from "@/components/icons/AppleIcon";
import { IOSAppleLogin, AndroidAppleLogin } from "@/features/auth/appleLogin";

export default function AppleLogin() {
  const handlePress =
    Platform.OS === "android" ? AndroidAppleLogin : IOSAppleLogin;
  return (
    <Pressable
      onPress={handlePress}
      className="mx-auto w-full max-w-[500px] flex-row items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 active:opacity-80"
    >
      <AppleIcon size={20} color="black" />
      <Text className="text-black">Apple로 시작하기</Text>
    </Pressable>
  );
}
