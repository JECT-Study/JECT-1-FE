import { useEffect } from "react";

import { initializeKakaoSDK } from "@react-native-kakao/core";
import { login } from "@react-native-kakao/user";
import { Button, SafeAreaView } from "react-native";

export default function KakaoLogin() {
  const kakaoNativeAppKey = process.env.KAKAO_NATIVE_APP_KEY || "";
  useEffect(() => {
    initializeKakaoSDK(kakaoNativeAppKey);
  }, []);

  async function kakaoLogin() {
    try {
      const res = await login();
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <SafeAreaView>
      <Button title="Kakao Login Test" onPress={kakaoLogin} />
    </SafeAreaView>
  );
}
