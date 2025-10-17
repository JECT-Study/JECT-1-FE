import React, { useEffect, useState } from "react";

import * as SecureStore from "expo-secure-store";
import { Image, Pressable, Text, View } from "react-native";

import HeartFilledIcon from "@/components/icons/HeartFilledIcon";
import HeartOutlineIcon from "@/components/icons/HeartOutlineIcon";
import Separator from "@/components/ui/Separator";
import { BACKEND_URL } from "@/constants/ApiUrls";
import { authApi } from "@/features/axios/axiosInstance";
import { formatAddress } from "@/utils/addressUtils";

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

interface FavoriteContentItemProps {
  info: infoInterface;
  onLikeChange?: (
    contentId: number,
    isLiked: boolean,
    likeCount: number,
  ) => void;
  showSeparator?: boolean;
}

export default function FavoriteContentItem({
  info,
  onLikeChange,
  showSeparator = true,
}: FavoriteContentItemProps) {
  const [isLikeLoading, setIsLikeLoading] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const hasImage = info.img_url && info.img_url.trim() !== "";
  const imageSource = hasImage
    ? { uri: info.img_url }
    : require("../../assets/images/content_placeholder.png");

  // 토큰 확인을 통한 로그인 상태 체크
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const accessToken = await SecureStore.getItemAsync("accessToken");
        const refreshToken = await SecureStore.getItemAsync("refreshToken");
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
      }
    } catch (error) {
      console.error("좋아요 오류:", error);
    } finally {
      setIsLikeLoading(false);
    }
  };

  return (
    <>
      <View className="flex-row">
        <Image
          source={imageSource}
          className="h-[92px] w-[92px] rounded-[4px] bg-gray-200"
          resizeMode="cover"
        />
        <View className="ml-3.5 mr-2 flex-1">
          <Text
            className="text-lg font-semibold leading-normal text-[#111]"
            numberOfLines={2}
          >
            {info.title}
          </Text>
          <Text className="text-[13px] leading-[1.4] text-[#9E9E9E]">
            {formatAddress(info.address)}
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
      {showSeparator && (
        <View className="py-5">
          <Separator />
        </View>
      )}
    </>
  );
}
