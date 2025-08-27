import { Image } from "expo-image";
import { Pressable, View } from "react-native";

import CameraIcon from "@/components/icons/CameraIcon";
import useImagePicker from "@/features/user/imagePicker";
import { useTempImageUri } from "@/stores/useEditProfileStore";

// 기본 프로필 이미지 (회색)
const DEFAULT_PROFILE_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTQiIGhlaWdodD0iOTQiIHZpZXdCb3g9IjAgMCA5NCA5NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDciIGN5PSI0NyIgcj0iNDciIGZpbGw9IiM5Q0EzQUYiLz4KPHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeD0iMjciIHk9IjI3Ij4KPHBhdGggZD0iTTIwIDIwQzI0LjQxODMgMjAgMjggMTYuNDE4MyAyOCAxMkMyOCA3LjU4MTcyIDI0LjQxODMgNCAyMCA0QzE1LjU4MTcgNCAxMiA3LjU4MTcyIDEyIDEyQzEyIDE2LjQxODMgMTUuNTgxNyAyMCAyMCAyMFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yMCAyNEM5IDI0IDAgMzMgMCA0NEg0MEMzNjAgMzMgMzEgMjQgMjAgMjRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+";

export default function EditProfileImage() {
  const { onPress } = useImagePicker();
  const profileUri = useTempImageUri();

  // null이나 빈 문자열인 경우 기본 이미지 사용
  const imageSource =
    profileUri && profileUri.trim() !== "" ? profileUri : DEFAULT_PROFILE_IMAGE;

  return (
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
          className="absolute bottom-0.5 right-0.5 flex size-[30px] items-center justify-center rounded-full border-2 border-[#F2F3F6] bg-white"
        >
          <CameraIcon />
        </Pressable>
      </View>
    </View>
  );
}
