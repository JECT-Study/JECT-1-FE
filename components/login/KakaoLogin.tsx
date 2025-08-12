import { useEffect } from "react";

import { Pressable, Text } from "react-native";

import KakaoIcon from "@/components/icons/KakaoIcon";
import { initializeKakao, kakaoLogin } from "@/features/auth/kakaoLogin";

export default function KakaoLogin() {
  useEffect(() => {
    initializeKakao();
  }, []);

  return (
    <Pressable
      onPress={kakaoLogin}
      className="mx-auto w-full max-w-[500px] flex-row items-center justify-center gap-2 rounded-xl bg-yellow-300 px-6 py-4 active:opacity-80"
    >
      <KakaoIcon size={20} color="#3E1918" />
      <Text className="text-black">카카오톡으로 시작하기</Text>
    </Pressable>
  );
}
