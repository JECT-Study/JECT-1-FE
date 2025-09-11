import { useCallback, useState } from "react";

import { AxiosError } from "axios";
import { Image } from "expo-image";
import { router, useFocusEffect } from "expo-router";
import { dismissAll } from "expo-router/build/global-state/routing";
import * as SecureStore from "expo-secure-store";
import { setStatusBarStyle } from "expo-status-bar";
import { Alert, Pressable, Text, View } from "react-native";

import CalendarEditIcon from "@/components/icons/CalendarEditIcon";
import DefaultProfileIcon from "@/components/icons/DefaultProfileIcon";
import DiaryIcon from "@/components/icons/DiaryIcon";
import HeartIcon from "@/components/icons/HeartIcon";
import NewChevronRight from "@/components/icons/NewChevronRight";
import LogoutAlert from "@/components/user/LogoutAlert";
import LogoutStatusModal from "@/components/user/LogoutStatusModal";
import usePageNavigation from "@/hooks/usePageNavigation";
import useUserStore from "@/stores/useUserStore";

export default function MyScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [nickname, setNickname] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string>("");
  const [showLogoutAlert, setShowLogoutAlert] = useState<boolean>(false);
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
  const [statusModalType, setStatusModalType] = useState<"success" | "error">(
    "success",
  );
  const [statusModalMessage, setStatusModalMessage] = useState<string>("");

  const { goEditProfile, goLike, goPlan, goSurvey, goTerms, goWithdrawal } =
    usePageNavigation();

  const handleAuthAction = async () => {
    if (!isLoggedIn) {
      // 로그인되지 않은 상태면 루트 페이지로 이동
      dismissAll();
      router.push("/");
      return;
    }

    // 로그인된 상태면 로그아웃 확인 모달 표시
    setShowLogoutAlert(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      // 로그아웃 API 호출
      // const response = await authApi.post("/auth/logout");

      // 로컬 저장소에서 토큰 및 사용자 정보 삭제
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
      await SecureStore.deleteItemAsync("nickname");
      await SecureStore.deleteItemAsync("profileImage");

      const { clearUserInfo } = useUserStore.getState().action;
      clearUserInfo();

      setShowLogoutAlert(false);

      // 성공 모달 표시
      setStatusModalType("success");
      setStatusModalMessage("로그아웃이 완료되었습니다.");
      setShowStatusModal(true);

      // 모달 표시 후 화면 이동
      setTimeout(() => {
        setShowStatusModal(false);
        router.dismissAll();
        router.push("/");
      }, 1500);
    } catch (error) {
      const axiosError = error as AxiosError;
      setShowLogoutAlert(false);

      // 에러 모달 표시
      setStatusModalType("error");
      setStatusModalMessage(
        `로그아웃 도중 에러가 발생했습니다. ${axiosError.message}`,
      );
      setShowStatusModal(true);
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutAlert(false);
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
      return null;
    }
    return profileImage && profileImage.trim() !== "" ? profileImage : null;
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
      <Text className="ml-6 mt-4 text-xl font-medium">마이페이지</Text>

      <View aria-label="user-info" className="ml-6 mt-7 flex h-[60px] flex-row">
        <View className="size-[60px] overflow-hidden rounded-full">
          {getProfileImageSource() ? (
            <Image
              source={getProfileImageSource()}
              style={{ width: 60, height: 60 }}
            />
          ) : (
            <DefaultProfileIcon size={60} />
          )}
        </View>
        <View className="ml-2 h-full justify-center p-2">
          <Text className="mr-1 text-[16px]">{getDisplayName()}</Text>
        </View>
      </View>

      <Pressable
        className="mx-6 mt-6 flex h-[32px] items-center justify-center rounded-[4px] bg-gray-100"
        onPress={handleEditProfile}
      >
        <Text className="text-sm font-medium">프로필 수정</Text>
      </Pressable>

      {/* MyMenus 통합 */}
      <View className="mx-6 my-4 flex flex-row items-center justify-center rounded-md bg-[#F2F3F6]">
        <Pressable
          onPress={handlePlan}
          className="m-2 flex h-[70px] w-[105px] items-center justify-center"
        >
          <DiaryIcon />
          <Text className="m-[3.25px] text-sm">나의일정</Text>
        </Pressable>
        <View
          aria-label="seperator"
          className="h-[20px] w-[1px] bg-[#DDDFE6]"
        />
        <Pressable
          onPress={handleLike}
          className="m-2 flex h-[70px] w-[105px] items-center justify-center"
        >
          <HeartIcon />
          <Text className="m-[3.25px] text-sm">관심목록</Text>
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
          <Text className="m-[3.25px] text-sm">취향 분석하기</Text>
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
          <Text className="text-base">이용약관</Text>
          <NewChevronRight />
        </Pressable>
        <Pressable
          onPress={handleAuthAction}
          className={`flex h-[50px] w-full flex-row items-center justify-between ${
            isLoggedIn ? "border-b-[1px] border-[#E5E5EC]" : ""
          }`}
        >
          <Text className="text-base">
            {isLoggedIn ? "로그아웃" : "로그인"}
          </Text>
          <NewChevronRight />
        </Pressable>
        {isLoggedIn && (
          <Pressable
            onPress={() => goWithdrawal()}
            className="flex h-[50px] w-full flex-row items-center justify-between"
          >
            <Text className="text-base">회원탈퇴</Text>
            <NewChevronRight />
          </Pressable>
        )}
      </View>

      {/* 로그아웃 확인 모달 */}
      <LogoutAlert
        isVisible={showLogoutAlert}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />

      {/* 로그아웃 상태 모달 */}
      <LogoutStatusModal
        isVisible={showStatusModal}
        type={statusModalType}
        message={statusModalMessage}
        onClose={() => setShowStatusModal(false)}
      />
    </View>
  );
}
