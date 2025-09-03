import { useCallback, useState } from "react";

import { Image } from "expo-image";
import { router, useFocusEffect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Alert, Pressable, SafeAreaView, Text, View } from "react-native";

import CalendarEditIcon from "@/components/icons/CalendarEditIcon";
import DiaryIcon from "@/components/icons/DiaryIcon";
import HeartIcon from "@/components/icons/HeartIcon";
import MyPageMenus from "@/components/mypage/MyPageMenus";
import usePageNavigation from "@/hooks/usePageNavigation";

// 기본 프로필 이미지 (회색)
const DEFAULT_PROFILE_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTQiIGhlaWdodD0iOTQiIHZpZXdCb3g9IjAgMCA5NCA5NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDciIGN5PSI0NyIgcj0iNDciIGZpbGw9IiM5Q0EzQUYiLz4KPHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeD0iMjciIHk9IjI3Ij4KPHBhdGggZD0iTTIwIDIwQzI0LjQxODMgMjAgMjggMTYuNDE4MyAyOCAxMkMyOCA3LjU4MTcyIDI0LjQxODMgNCAyMCA0QzE1LjU4MTcgNCAxMiA3LjU4MTcyIDEyIDEyQzEyIDE2LjQxODMgMTUuNTgxNyAyMCAyMCAyMFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yMCAyNEM5IDI0IDAgMzMgMCA0NEg0MEMzNjAgMzMgMzEgMjQgMjAgMjRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+";

export default function MyScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [nickname, setNickname] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string>("");

  const { goEditProfile, goLike, goPlan, goSurvey } = usePageNavigation();

  // 화면 포커스 시 실행 (마운트 시도 포함)
  useFocusEffect(
    useCallback(() => {
      const checkLoginStatus = async () => {
        try {
          const accessToken = await SecureStore.getItemAsync("accessToken");
          const refreshToken = await SecureStore.getItemAsync("refreshToken");

          if (accessToken && refreshToken) {
            setIsLoggedIn(true);

            // 로그인 상태일 때 사용자 정보도 SecureStore에서 로드
            const savedNickname = await SecureStore.getItemAsync("nickname");
            const savedProfileImage =
              await SecureStore.getItemAsync("profileImage");

            console.log("🔍 MyScreen 사용자 정보 로드:", {
              nickname: savedNickname,
              profileImage: savedProfileImage ? "있음" : "없음",
              profileImageValue: savedProfileImage,
            });

            setNickname(savedNickname || "");
            setProfileImage(savedProfileImage || "");
          } else {
            setIsLoggedIn(false);
            setNickname("");
            setProfileImage("");
          }
        } catch (error) {
          console.log("❌ MyScreen 토큰 확인 중 에러:", error);
          setIsLoggedIn(false);
          setNickname("");
          setProfileImage("");
        }
      };
      checkLoginStatus();
    }, []),
  );

  // 프로필 수정 버튼 클릭 핸들러
  const handleEditProfile = () => {
    if (!isLoggedIn) {
      Alert.alert(
        "로그인이 필요합니다",
        "프로필을 수정하려면 먼저 로그인해주세요.",
        [
          {
            text: "취소",
            style: "cancel",
          },
          {
            text: "로그인하러 가기",
            onPress: () => router.push("/"),
          },
        ],
      );
      return;
    }
    goEditProfile();
  };

  // 프로필 이미지 결정 로직
  const getProfileImageSource = () => {
    if (!isLoggedIn) {
      return DEFAULT_PROFILE_IMAGE;
    }
    return profileImage && profileImage.trim() !== ""
      ? profileImage
      : DEFAULT_PROFILE_IMAGE;
  };

  // 닉네임 결정 로직
  const getDisplayName = () => {
    if (!isLoggedIn) {
      return "사용자";
    }
    return nickname || "사용자";
  };

  // 나의일정 버튼 클릭 핸들러
  const handlePlan = () => {
    if (!isLoggedIn) {
      Alert.alert(
        "로그인이 필요합니다",
        "나의일정을 보려면 먼저 로그인해주세요.",
        [
          {
            text: "취소",
            style: "cancel",
          },
          {
            text: "로그인하러 가기",
            onPress: () => router.push("/"),
          },
        ],
      );
      return;
    }
    goPlan();
  };

  // 관심목록 버튼 클릭 핸들러
  const handleLike = () => {
    if (!isLoggedIn) {
      Alert.alert(
        "로그인이 필요합니다",
        "관심목록을 보려면 먼저 로그인해주세요.",
        [
          {
            text: "취소",
            style: "cancel",
          },
          {
            text: "로그인하러 가기",
            onPress: () => router.push("/"),
          },
        ],
      );
      return;
    }
    goLike();
  };

  // 취향 분석하기 버튼 클릭 핸들러
  const handleSurvey = () => {
    if (!isLoggedIn) {
      Alert.alert(
        "로그인이 필요합니다",
        "취향 분석을 하려면 먼저 로그인해주세요.",
        [
          {
            text: "취소",
            style: "cancel",
          },
          {
            text: "로그인하러 가기",
            onPress: () => router.push("/"),
          },
        ],
      );
      return;
    }
    goSurvey();
  };

  return (
    <SafeAreaView className="w-full flex-1 bg-white">
      <Text className="ml-6 mt-10 text-[18px]">마이페이지</Text>

      <View aria-label="user-info" className="ml-6 mt-6 flex h-[60px] flex-row">
        <View className="size-[60px] overflow-hidden rounded-full">
          <Image
            source={getProfileImageSource()}
            style={{ width: 60, height: 60 }}
          />
        </View>
        <View className="ml-2 h-full justify-center p-2">
          <Text className="mr-1 text-[16px]">{getDisplayName()}</Text>
        </View>
      </View>

      <Pressable
        className="mx-6 mt-6 flex h-[32px] items-center justify-center rounded-[4px] bg-gray-100"
        onPress={handleEditProfile}
      >
        <Text className="text-[12px]">프로필 수정</Text>
      </Pressable>

      {/* MyMenus 통합 */}
      <View className="mx-6 my-4 flex flex-row items-center justify-center rounded-md bg-[#F2F3F6]">
        <Pressable
          onPress={handlePlan}
          className="m-2 flex h-[70px] w-[105px] items-center justify-center"
        >
          <DiaryIcon />
          <Text className="m-[3.25px] text-[13px]">나의일정</Text>
        </Pressable>
        <View
          aria-label="seperator"
          className="h-[20px] w-[1px] bg-[#DDDFE6]"
        />
        <Pressable
          onPress={handleLike}
          className="m-2 flex h-[70px] w-[105px] items-center justify-center"
        >
          <HeartIcon size={24} />
          <Text className="m-[3.25px] text-[13px]">관심목록</Text>
        </Pressable>
        <View
          aria-label="seperator"
          className="h-[20px] w-[1px] bg-[#DDDFE6]"
        />
        <Pressable
          onPress={handleSurvey}
          className="m-2 flex h-[70px] w-[105px] items-center justify-center"
        >
          <CalendarEditIcon />
          <Text className="m-[3.25px] text-[13px]">취향 분석하기</Text>
        </Pressable>
      </View>

      <View
        aria-label="seperator"
        className="my-2 h-[12px] w-full bg-[#F2F2F7]"
      />
      <MyPageMenus />
    </SafeAreaView>
  );
}
