import { useEffect } from "react";

import { initializeKakaoSDK } from "@react-native-kakao/core";
import { login } from "@react-native-kakao/user";
import Constants from "expo-constants";
import { Button, SafeAreaView } from "react-native";

export default function KakaoLogin() {
  const kakaoNativeAppKey =
    Constants.expoConfig?.extra?.kakaoNativeAppKey ?? "";
  console.log("KakaoNativeAppKey!", kakaoNativeAppKey);
  useEffect(() => {
    initializeKakaoSDK(kakaoNativeAppKey);
  }, [kakaoNativeAppKey]);

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
