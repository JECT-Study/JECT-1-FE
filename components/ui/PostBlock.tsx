import React, { useEffect, useState } from "react";

import * as SecureStore from "expo-secure-store";
import { Image, Platform, Pressable, Text, View } from "react-native";

import HeartFilledIcon from "@/components/icons/HeartFilledIcon";
import HeartOutlineIcon from "@/components/icons/HeartOutlineIcon";
import Separator from "@/components/ui/Separator";
import { BACKEND_URL } from "@/constants/ApiUrls";
import { authApi } from "@/features/axios/axiosInstance";
import { getImageSource } from "@/utils/imageUtils";

interface infoInterface {
  contentId: number;
  title: string;
  address: string;
  start_date: string;
  end_date: string;
  img_url?: string;
  likeId?: number | null;
  likes?: number;
}

interface PostBlockProps {
  info: infoInterface;
  onLikeChange?: (
    contentId: number,
    isLiked: boolean,
    likeCount: number,
  ) => void;
}

export default function PostBlock({ info, onLikeChange }: PostBlockProps) {
  const [isLikeLoading, setIsLikeLoading] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // 플랫폼별 토큰 조회 함수
  const getTokenAsync = async (key: string): Promise<string | null> => {
    if (Platform.OS === "web") {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  };

  // 토큰 확인을 통한 로그인 상태 체크
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const accessToken = await getTokenAsync("accessToken");
        const refreshToken = await getTokenAsync("refreshToken");
        setIsLoggedIn(!!(accessToken && refreshToken));
      } catch (error) {
        console.error("토큰 확인 실패:", error);
        setIsLoggedIn(false);
      }
    };

    checkAuthStatus();
  }, []);

  // 초기 좋아요 상태 설정
  useEffect(() => {
    if (info) {
      setIsLiked(info.likeId !== null && info.likeId !== undefined);
    }
  }, [info]);

  // 좋아요 토글 함수
  const handleLikeToggle = async () => {
    if (!info.contentId || isLikeLoading || !isLoggedIn) return;

    setIsLikeLoading(true);

    // 현재 좋아요 상태를 미리 저장
    const currentIsLiked = isLiked;

    try {
      let response;

      if (!currentIsLiked) {
        // 좋아요 추가
        response = await authApi.post(
          `${BACKEND_URL}/contents/${info.contentId}/favorites`,
        );
      } else {
        // 좋아요 취소
        response = await authApi.delete(
          `${BACKEND_URL}/contents/${info.contentId}/favorites`,
        );
      }

      if (response.data.isSuccess) {
        // UI 상태 업데이트
        setIsLiked(!currentIsLiked);

        // 부모 컴포넌트에 변경사항 알리기
        if (onLikeChange) {
          onLikeChange(info.contentId, !currentIsLiked, 0);
        }

        console.log(
          `좋아요 ${!currentIsLiked ? "추가" : "취소"} 완료: ${info.title}`,
        );
      }
    } catch (error) {
      console.error("좋아요 오류:", error);
    } finally {
      setIsLikeLoading(false);
    }
  };

  return (
    <>
      <View className="my-[18px] flex flex-row items-center">
        <Image
          source={
            info.img_url
              ? { uri: info.img_url }
              : getImageSource(info.contentId)
          }
          className="h-[92px] w-[92px] rounded-[4px] bg-gray-200"
          resizeMode="cover"
        />
        <View className="ml-[18px] flex-1 justify-center">
          <Text className="text-[16px] font-semibold leading-normal text-[#111]">
            {info.title}
          </Text>
          <Text className="text-[13px] leading-[1.4] text-[#9E9E9E]">
            {info.address}
          </Text>
          <Text className="text-[13px] leading-normal text-[#6D6D6D]">
            {info.start_date} - {info.end_date}
          </Text>
        </View>
        <View className="items-center justify-center">
          <Pressable
            className="items-center justify-center"
            style={({ pressed }) => [
              {
                opacity: !isLoggedIn || isLikeLoading ? 0.5 : pressed ? 0.7 : 1,
              },
            ]}
            onPress={handleLikeToggle}
            disabled={!isLoggedIn || isLikeLoading}
          >
            {isLiked ? (
              <HeartFilledIcon
                size={28}
                color={!isLoggedIn ? "#BDBDBD" : undefined}
              />
            ) : (
              <HeartOutlineIcon
                size={28}
                color={!isLoggedIn ? "#BDBDBD" : undefined}
              />
            )}
          </Pressable>
        </View>
      </View>
      <View className="px-2">
        <Separator />
      </View>
    </>
  );
}
