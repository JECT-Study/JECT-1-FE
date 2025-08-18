import { useEffect } from "react";

import { Pressable, Text } from "react-native";

import KakaoIcon from "@/components/icons/KakaoIcon";
import { initializeKakao, kakaoLogin } from "@/features/auth/kakaoLogin";

interface KakaoLoginProps {
  disabled?: boolean;
}

export default function KakaoLogin({ disabled = false }: KakaoLoginProps) {
  useEffect(() => {
    initializeKakao();
  }, []);

  return (
    <Pressable
      onPress={disabled ? undefined : kakaoLogin}
      disabled={disabled}
      className={`mx-auto h-14 w-full flex-row items-center justify-center gap-2 rounded-xl bg-[#F9DB00] px-6 ${
        disabled ? "opacity-50" : "active:opacity-80"
      }`}
    >
      <KakaoIcon size={20} color="#3E1918" />
      <Text className="text-lg font-medium text-black">
        카카오톡으로 시작하기
      </Text>
    </Pressable>
  );
}
