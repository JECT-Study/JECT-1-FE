import { useCallback, useState } from "react";

import { AxiosError } from "axios";
import { Image } from "expo-image";
import { router, useFocusEffect } from "expo-router";
import { dismissAll } from "expo-router/build/global-state/routing";
import * as SecureStore from "expo-secure-store";
import { setStatusBarStyle } from "expo-status-bar";
import { Alert, Pressable, Text, View } from "react-native";

import CalendarEditIcon from "@/components/icons/CalendarEditIcon";
import Chevron from "@/components/icons/Chevron";
import DiaryIcon from "@/components/icons/DiaryIcon";
import HeartIcon from "@/components/icons/HeartIcon";
import { authApi } from "@/features/axios/axiosInstance";
import usePageNavigation from "@/hooks/usePageNavigation";
import useUserStore from "@/stores/useUserStore";

// 기본 프로필 이미지 (회색)
const DEFAULT_PROFILE_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTQiIGhlaWdodD0iOTQiIHZpZXdCb3g9IjAgMCA5NCA5NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDciIGN5PSI0NyIgcj0iNDciIGZpbGw9IiM5Q0EzQUYiLz4KPHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeD0iMjciIHk9IjI3Ij4KPHBhdGggZD0iTTIwIDIwQzI0LjQxODMgMjAgMjggMTYuNDE4MyAyOCAxMkMyOCA3LjU4MTcyIDI0LjQxODMgNCAyMCA0QzE1LjU4MTcgNCAxMiA3LjU4MTcyIDEyIDEyQzEyIDE2LjQxODMgMTUuNTgxNyAyMCAyMCAyMFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yMCAyNEM5IDI0IDAgMzMgMCA0NEg0MEMzNjAgMzMgMzEgMjQgMjAgMjRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+";

export default function MyScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [nickname, setNickname] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string>("");

  const { goEditProfile, goLike, goPlan, goSurvey, goTerms, goWithdrawal } =
    usePageNavigation();

  const handleAuthAction = async () => {
    if (!isLoggedIn) {
      // 로그인되지 않은 상태면 루트 페이지로 이동
      dismissAll();
      router.push("/");
      return;
    }

    // 로그인된 상태면 로그아웃 확인 다이얼로그 표시
    Alert.alert(
      "로그아웃",
      "정말 로그아웃 하시겠어요?",
      [
        {
          text: "취소",
          style: "default",
        },
        {
          text: "로그아웃",
          onPress: async () => {
            try {
              // 로그아웃 API 호출
              const response = await authApi.post("/auth/logout");

              if (response.data.isSuccess) {
                // 로컬 저장소에서 토큰 및 사용자 정보 삭제
                await SecureStore.deleteItemAsync("accessToken");
                await SecureStore.deleteItemAsync("refreshToken");
                await SecureStore.deleteItemAsync("nickname");
                await SecureStore.deleteItemAsync("profileImage");

                const { clearUserInfo } = useUserStore.getState().action;
                clearUserInfo();

                alert("로그아웃이 완료되었습니다.");

                router.dismissAll();
                router.push("/");
              } else {
                alert(
                  `로그아웃에 실패했습니다. ${response.data.message || "알 수 없는 오류"}`,
                );
              }
            } catch (error) {
              const axiosError = error as AxiosError;
              alert(`로그아웃 도중 에러가 발생했습니다. ${axiosError.message}`);
            }
          },
          style: "default",
        },
      ],
      { cancelable: true },
    );
  };

  // 화면 포커스 시 실행 (마운트 시도 포함)
  useFocusEffect(
    useCallback(() => {
      // StatusBar 스타일을 dark로 설정
      setStatusBarStyle("dark");

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
    <View className="w-full flex-1 bg-white pt-[65px]">
      <Text className="ml-6 mt-4 text-[18px]">마이페이지</Text>

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

      {/* MyPageMenus 내용 직접 구현 */}
      <View className="w-full px-4">
        <Pressable
          onPress={() => goTerms()}
          className="flex h-[50px] w-full flex-row items-center justify-between border-b-[1px] border-[#E5E5EC]"
        >
          <Text className="text-[14px]">이용약관</Text>
          <Chevron direction={"right"} />
        </Pressable>
        <Pressable
          onPress={handleAuthAction}
          className="flex h-[50px] w-full flex-row items-center justify-between border-b-[1px] border-[#E5E5EC]"
        >
          <Text className="text-[14px]">
            {isLoggedIn ? "로그아웃" : "로그인"}
          </Text>
          <Chevron direction={"right"} />
        </Pressable>
        {isLoggedIn && (
          <Pressable
            onPress={() => goWithdrawal()}
            className="flex h-[50px] w-full flex-row items-center justify-between border-b-[1px] border-[#E5E5EC]"
          >
            <Text className="text-[14px]">회원탈퇴</Text>
            <Chevron direction={"right"} />
          </Pressable>
        )}
      </View>
    </View>
  );
}
