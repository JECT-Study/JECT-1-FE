import { useEffect, useState } from "react";

import { Image } from "expo-image";
import { router } from "expo-router";
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
import { BACKEND_URL } from "@/constants/ApiUrls";
import { authApi } from "@/features/axios/axiosInstance";
import useImagePicker from "@/features/user/imagePicker";
import {
  useCancelEditProfile,
  useInitializeFromUserStore,
  useTempImageUri,
} from "@/stores/useEditProfileStore";
import {
  useNickname,
  useSetNickname,
  useSetProfileImage,
} from "@/stores/useUserStore";

// 기본 프로필 이미지 (회색)
const DEFAULT_PROFILE_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTQiIGhlaWdodD0iOTQiIHZpZXdCb3g9IjAgMCA5NCA5NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDciIGN5PSI0NyIgcj0iNDciIGZpbGw9IiM5Q0EzQUYiLz4KPHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeD0iMjciIHk9IjI3Ij4KPHBhdGggZD0iTTIwIDIwQzI0LjQxODMgMjAgMjggMTYuNDE4MyAyOCAxMkMyOCA3LjU4MTcyIDI0LjQxODMgNCAyMCA0QzE1LjU4MTcgNCAxMiA3LjU4MTcyIDEyIDEyQzEyIDE2LjQxODMgMTUuNTgxNyAyMCAyMCAyMFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yMCAyNEM5IDI0IDAgMzMgMCA0NEg0MEMzNiAzMyAzMSAyNCAyMCAyNFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo8L3N2Zz4K";

export default function EditProfile() {
  const cancelEdit = useCancelEditProfile();
  const initializeFromUserStore = useInitializeFromUserStore();
  const currentNickname = useNickname();
  const setGlobalNickname = useSetNickname();
  const setGlobalProfileImage = useSetProfileImage();

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false);

  // 프로필 이미지 관련
  const { onPress } = useImagePicker();
  const profileUri = useTempImageUri();

  console.log("profileUri", profileUri);

  // 닉네임 관련 - 직접 상태 관리
  const [inputNickname, setInputNickname] = useState("");

  // 페이지 진입 시 userStore의 정보로 초기화
  useEffect(() => {
    initializeFromUserStore();
    // 사용자 닉네임으로 초기화
    if (currentNickname) {
      setInputNickname(currentNickname);
    }
  }, [initializeFromUserStore, currentNickname]);

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

        // 이미지가 업데이트된 경우 전역 상태에도 반영
        if (hasNewImage && response.data.result?.profileImage) {
          setGlobalProfileImage(response.data.result.profileImage);
        } else if (hasNewImage && profileUri) {
          // 서버에서 이미지 URL을 반환하지 않는 경우, 로컬 URI 사용
          setGlobalProfileImage(profileUri);
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

  // null이나 빈 문자열인 경우 기본 이미지 사용
  const imageSource =
    profileUri && profileUri.trim() !== "" ? profileUri : DEFAULT_PROFILE_IMAGE;

  return (
    <SafeAreaView className="w-full flex-1 items-center bg-white">
      <CustomHeader
        title="프로필 수정"
        isCommit={true}
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
    </SafeAreaView>
  );
}
