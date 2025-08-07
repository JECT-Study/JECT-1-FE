import axios, { AxiosError } from "axios";
import * as AppleAuthentication from "expo-apple-authentication";
import * as SecureStore from "expo-secure-store";

import { LoginUrl } from "@/constants/ApiUrls";

export async function IOSAppleLogin() {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
    const id = credential.user;
    // console.log("userid", id);
    const response = await axios.post(LoginUrl, {
      socialId: id,
      socialType: "APPLE",
    });
    // console.log("response", response);
    const accessToken = response.data.result.accessToken;
    const refreshToken = response.data.result.refreshToken;
    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("refreshToken", refreshToken);
  } catch (error) {
    const axiosError = error as AxiosError;
    alert(`애플 로그인 도중 서버 에러가 발생했습니다. ${axiosError.message}`);
  }
}

export async function AndroidAppleLogin() {
  console.log("Android Login");
}
