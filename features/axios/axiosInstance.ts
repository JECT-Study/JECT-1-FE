import axios from "axios";
import Constants from "expo-constants";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

const baseURL = Constants.expoConfig?.extra?.BACKEND_URL ?? "";

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
  paramsSerializer: {
    indexes: null, // regions[]=값 대신 regions=값 형식으로 변환
  },
});

authApi.interceptors.request.use(
  async (config) => {
    try {
      const accessToken = await SecureStore.getItemAsync("accessToken");

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      } else {
        console.log("액세스 토큰이 없습니다. 로그인이 필요할 수 있습니다.");
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
        console.log(
          "토큰이 만료되었습니다. 리프레시 토큰으로 갱신을 시도합니다.",
        );

        const refreshToken = await SecureStore.getItemAsync("refreshToken");

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
          await SecureStore.setItemAsync("accessToken", newAccessToken);
        } else {
          throw new Error("새로운 액세스 토큰을 받지 못했습니다.");
        }

        if (newRefreshToken) {
          await SecureStore.setItemAsync("refreshToken", newRefreshToken);
        }

        // 원래 요청에 새 토큰 적용하여 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        console.log("토큰 갱신 성공, 원래 요청을 재시도합니다.");
        return authApi(originalRequest);
      } catch (refreshError) {
        console.error("토큰 갱신 실패:", refreshError);

        // 리프레시 실패 시 저장된 토큰 삭제 및 로그인 페이지로 이동
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");

        console.log("로그인 페이지로 이동합니다.");
        router.replace("/");

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
