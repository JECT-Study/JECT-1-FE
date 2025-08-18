import { Platform, Pressable, Text } from "react-native";

import AppleIcon from "@/components/icons/AppleIcon";
import { AndroidAppleLogin, IOSAppleLogin } from "@/features/auth/appleLogin";

interface AppleLoginProps {
  disabled?: boolean;
}

export default function AppleLogin({ disabled = false }: AppleLoginProps) {
  const handlePress =
    Platform.OS === "android" ? AndroidAppleLogin : IOSAppleLogin;

  return (
    <Pressable
      onPress={disabled ? undefined : handlePress}
      disabled={disabled}
      className={`mx-auto h-14 w-full flex-row items-center justify-center gap-2 rounded-xl bg-white px-6 ${
        disabled ? "opacity-50" : "active:opacity-80"
      }`}
    >
      <AppleIcon size={20} color="black" />
      <Text className="text-lg font-medium text-black">Apple로 시작하기</Text>
    </Pressable>
  );
}
