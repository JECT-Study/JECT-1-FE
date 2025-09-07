import { useEffect, useState } from "react";

import { Image } from "expo-image";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import {
  Alert,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";

import CameraIcon from "@/components/icons/CameraIcon";
import XIcon from "@/components/icons/X";
import CustomHeader from "@/components/ui/CustomHeader";
import ImagePickerBottomSheet from "@/components/ui/ImagePickerBottomSheet";
import { BACKEND_URL } from "@/constants/ApiUrls";
import { authApi } from "@/features/axios/axiosInstance";
import useCustomImagePicker from "@/features/user/useCustomImagePicker";
import {
  useCancelEditProfile,
  useInitializeFromUserStore,
  useTempImageUri,
} from "@/stores/useEditProfileStore";
import { useSetNickname, useSetProfileImage } from "@/stores/useUserStore";

// 기본 프로필 이미지 (회색)
const DEFAULT_PROFILE_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTQiIGhlaWdodD0iOTQiIHZpZXdCb3g9IjAgMCA5NCA5NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDciIGN5PSI0NyIgcj0iNDciIGZpbGw9IiM5Q0EzQUYiLz4KPHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeD0iMjciIHk9IjI3Ij4KPHBhdGggZD0iTTIwIDIwQzI0LjQxODMgMjAgMjggMTYuNDE4MyAyOCAxMkMyOCA3LjU4MTcyIDI0LjQxODMgNCAyMCA0QzE1LjU4MTcgNCAxMiA3LjU4MTcyIDEyIDEyQzEyIDE2LjQxODMgMTUuNTgxNyAyMCAyMCAyMFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yMCAyNEM5IDI0IDAgMzMgMCA0NEg0MEMzNiAzMyAzMSAyNCAyMCAyNFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo8L3N2Zz4K";

export default function EditProfile() {
  const cancelEdit = useCancelEditProfile();
  const initializeFromUserStore = useInitializeFromUserStore();
  const setGlobalNickname = useSetNickname();
  const setGlobalProfileImage = useSetProfileImage();

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false);

  // 프로필 이미지 관련
  const { onPress, isBottomSheetOpen, onCloseBottomSheet, onLibrary } =
    useCustomImagePicker();
  const profileUri = useTempImageUri();

  // 닉네임 관련 - 직접 상태 관리
  const [inputNickname, setInputNickname] = useState("");
  const [currentProfileImage, setCurrentProfileImage] = useState("");

  // 페이지 진입 시 SecureStore에서 사용자 정보 로드
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const savedNickname = await SecureStore.getItemAsync("nickname");
        const savedProfileImage =
          await SecureStore.getItemAsync("profileImage");

        if (savedNickname) {
          setInputNickname(savedNickname);
        }

        if (savedProfileImage) {
          setCurrentProfileImage(savedProfileImage);
        }

        // Zustand store도 초기화 (다른 컴포넌트와의 일관성을 위해)
        initializeFromUserStore();
      } catch (error) {
        console.error("사용자 정보 로드 실패:", error);
      }
    };

    loadUserInfo();
  }, [initializeFromUserStore]);

  // 프로필 업데이트 API 요청
  const handleUpdateProfile = async () => {
    if (!inputNickname.trim()) {
      Alert.alert("알림", "닉네임을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();

      // 닉네임 추가
      formData.append("nickname", inputNickname.trim());

      // 이미지 추가 (새로운 이미지가 선택된 경우에만)
      const hasNewImage =
        profileUri &&
        profileUri.trim() !== "" &&
        !profileUri.startsWith("data:image/svg+xml");

      if (hasNewImage) {
        const imageUri = profileUri;
        const filename = imageUri.split("/").pop() || "profile.jpg";

        // 파일 확장자에 따른 MIME 타입 설정
        let mimeType = "image/jpeg"; // 기본값
        if (filename.toLowerCase().includes(".png")) {
          mimeType = "image/png";
        } else if (
          filename.toLowerCase().includes(".jpg") ||
          filename.toLowerCase().includes(".jpeg")
        ) {
          mimeType = "image/jpeg";
        } else if (filename.toLowerCase().includes(".gif")) {
          mimeType = "image/gif";
        } else if (filename.toLowerCase().includes(".webp")) {
          mimeType = "image/webp";
        }

        // React Native에서 FormData에 파일 추가하는 방식 (블로그 참고)
        const imageFile = {
          uri: imageUri,
          type: mimeType,
          name: filename,
        } as any;

        // 이미지를 FormData에 추가
        formData.append("image", imageFile);
      } else {
        console.log("No new image selected, profileUri:", profileUri);
      }

      const response = await authApi.patch(
        `${BACKEND_URL}/users/profile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.isSuccess) {
        // 전역 상태 업데이트
        setGlobalNickname(inputNickname.trim());

        // SecureStore에도 닉네임 업데이트
        await SecureStore.setItemAsync("nickname", inputNickname.trim());

        // 이미지가 업데이트된 경우 전역 상태에도 반영
        if (hasNewImage && response.data.result?.profileImage) {
          setGlobalProfileImage(response.data.result.profileImage);
          // SecureStore에도 프로필 이미지 업데이트
          await SecureStore.setItemAsync(
            "profileImage",
            response.data.result.profileImage,
          );
        } else if (hasNewImage && profileUri) {
          // 서버에서 이미지 URL을 반환하지 않는 경우, 로컬 URI 사용
          setGlobalProfileImage(profileUri);
          // SecureStore에도 프로필 이미지 업데이트
          await SecureStore.setItemAsync("profileImage", profileUri);
        }

        Alert.alert("성공", "프로필이 성공적으로 업데이트되었습니다.", [
          {
            text: "확인",
            onPress: () => {
              router.back();
            },
          },
        ]);
      } else {
        Alert.alert(
          "오류",
          response.data.message || "프로필 업데이트에 실패했습니다.",
        );
      }
    } catch (error) {
      console.error("프로필 업데이트 오류:", error);
      Alert.alert("오류", "프로필 업데이트 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 이미지 소스 결정 로직
  const getImageSource = () => {
    // 1. 새로 선택한 이미지가 있고, 기본 SVG 이미지가 아닌 경우에만 사용
    if (
      profileUri &&
      profileUri.trim() !== "" &&
      !profileUri.startsWith("data:image/svg+xml")
    ) {
      console.log("✅ 새로 선택한 이미지 사용:", profileUri);
      return profileUri;
    }

    // 2. 현재 사용자의 프로필 이미지가 있으면 사용
    if (currentProfileImage && currentProfileImage.trim() !== "") {
      console.log("✅ 현재 프로필 이미지 사용:", currentProfileImage);
      return currentProfileImage;
    }

    // 3. 둘 다 없으면 기본 이미지 사용
    console.log("✅ 기본 이미지 사용");
    return DEFAULT_PROFILE_IMAGE;
  };

  const imageSource = getImageSource();

  return (
    <SafeAreaView className="w-full flex-1 items-center bg-white">
      <CustomHeader
        title="프로필 수정"
        isCommit={true}
        separator
        commit={handleUpdateProfile}
        cancel={() => {
          cancelEdit();
          router.back();
        }}
      />

      {/* 프로필 이미지 섹션 */}
      <View aria-label="edit profile" className="m-6">
        <View
          aria-label="profile_image"
          className="relative size-[94px] rounded-full"
        >
          <Image
            source={imageSource}
            style={{ width: 94, height: 94, borderRadius: "100%" }}
          />
          <Pressable
            onPress={onPress}
            disabled={isLoading}
            className="absolute bottom-0.5 right-0.5 flex size-[30px] items-center justify-center rounded-full border-2 border-[#F2F3F6] bg-white"
            style={({ pressed }) => [
              { opacity: isLoading ? 0.5 : pressed ? 0.7 : 1 },
            ]}
          >
            <CameraIcon />
          </Pressable>
        </View>
      </View>

      {/* 닉네임 섹션 */}
      <View className="w-full p-6">
        <Text>닉네임</Text>
        <View className="relative my-3 h-[45px] w-full">
          <TextInput
            className="h-full w-full rounded-[4px] border-[1px] border-[#D1D3D8] bg-white px-4 pr-10"
            placeholder="닉네임을 입력해주세요."
            placeholderTextColor="#9CA3AF"
            onChangeText={setInputNickname}
            value={inputNickname}
            editable={!isLoading}
            style={{ opacity: isLoading ? 0.5 : 1 }}
          />
          {inputNickname.length > 0 && (
            <Pressable
              onPress={() => setInputNickname("")}
              disabled={isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={({ pressed }) => [
                { opacity: isLoading ? 0.5 : pressed ? 0.7 : 1 },
              ]}
            >
              <XIcon size={20} />
            </Pressable>
          )}
        </View>
        {inputNickname.length > 0 ? null : (
          <Text className="text-[12px] text-[#DC0000]">
            닉네임을 입력해주세요!
          </Text>
        )}
      </View>

      {/* 이미지 피커 바텀시트 */}
      <ImagePickerBottomSheet
        isOpen={isBottomSheetOpen}
        onClose={onCloseBottomSheet}
        onLibrary={onLibrary}
      />
    </SafeAreaView>
  );
}
