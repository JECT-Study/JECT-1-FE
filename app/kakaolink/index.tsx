import { useEffect } from "react";

import { useRouter } from "expo-router";
import { View } from "react-native";

export default function KakaoLink() {
  const router = useRouter();

  useEffect(() => {
    // 스택을 모두 제거하고 이동
    router.dismissAll();
    router.replace("/(tabs)");
  }, [router]);

  return <View />;
}
