import axios from "axios";
import Constants from "expo-constants";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const baseURL = Constants.expoConfig?.extra?.BACKEND_URL ?? "";

// 플랫폼별 토큰 저장 함수
async function setTokenAsync(key: string, value: string) {
  if (Platform.OS === "web") {
    localStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

// 플랫폼별 토큰 조회 함수
async function getTokenAsync(key: string): Promise<string | null> {
  if (Platform.OS === "web") {
    return localStorage.getItem(key);
  } else {
    return await SecureStore.getItemAsync(key);
  }
}

// 플랫폼별 토큰 삭제 함수
async function deleteTokenAsync(key: string) {
  if (Platform.OS === "web") {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
}

export const publicApi = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authApi = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

authApi.interceptors.request.use(
  async (config) => {
    try {
      // const accessToken = token;
      const accessToken = await getTokenAsync("accessToken");

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      } else {
        console.warn("액세스 토큰이 없습니다. 로그인이 필요할 수 있습니다.");
      }
    } catch (error) {
      console.error("토큰 조회 실패:", error);
    }
    return config;
  },
  (error) => {
    console.error("Request 인터셉터 에러:", error);
    return Promise.reject(error);
  },
);

authApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 에러 (토큰 만료/무효)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await getTokenAsync("refreshToken");

        if (!refreshToken) {
          throw new Error("리프레시 토큰이 없습니다.");
        }

        // 리프레시 토큰으로 새 액세스 토큰 요청
        const refreshResponse = await publicApi.post("/auth/token/refresh", {
          refreshToken,
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          refreshResponse.data.result;

        // 새 토큰 저장
        if (newAccessToken) {
          await setTokenAsync("accessToken", newAccessToken);
        } else {
          throw new Error("새로운 액세스 토큰을 받지 못했습니다.");
        }

        if (newRefreshToken) {
          await setTokenAsync("refreshToken", newRefreshToken);
        }

        // 원래 요청에 새 토큰 적용하여 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return authApi(originalRequest);
      } catch (refreshError) {
        console.error("토큰 갱신 실패:", refreshError);

        // 리프레시 실패 시 저장된 토큰 삭제 및 로그인 페이지로 이동
        await deleteTokenAsync("accessToken");
        await deleteTokenAsync("refreshToken");
        router.replace("/");

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
