import axios, { AxiosError } from "axios";
import * as AppleAuthentication from "expo-apple-authentication";

import { LoginUrl } from "@/constants/ApiUrls";

export async function IOSAppleLogin() {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
    console.log("credential", credential);
    const id = credential.user;
    await axios.post(LoginUrl, {
      id,
      social: "APPLE",
    });
  } catch (error) {
    const axiosError = error as AxiosError;
    alert(`애플 로그인 도중 서버 에러가 발생했습니다. ${axiosError.message}`);
  }
}

export async function AndroidAppleLogin() {
  console.log("Android Login");
}
