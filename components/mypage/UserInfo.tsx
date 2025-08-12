import { Image } from "expo-image";
import { View, Text } from "react-native";

import useUserStore from "@/stores/useUserStore";

// 기본 프로필 이미지 (회색)
const DEFAULT_PROFILE_IMAGE = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTQiIGhlaWdodD0iOTQiIHZpZXdCb3g9IjAgMCA5NCA5NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDciIGN5PSI0NyIgcj0iNDciIGZpbGw9IiM5Q0EzQUYiLz4KPHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeD0iMjciIHk9IjI3Ij4KPHBhdGggZD0iTTIwIDIwQzI0LjQxODMgMjAgMjggMTYuNDE4MyAyOCAxMkMyOCA3LjU4MTcyIDI0LjQxODMgNCAyMCA0QzE1LjU4MTcgNCAxMiA3LjU4MTcyIDEyIDEyQzEyIDE2LjQxODMgMTUuNTgxNyAyMCAyMCAyMFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yMCAyNEM5IDI0IDAgMzMgMCA0NEg0MEMzNjAgMzMgMzEgMjQgMjAgMjRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+";

export default function UserInfo() {
  const { nickname, profileImage } = useUserStore();
  
  // 프로필 이미지가 없거나 빈 문자열인 경우 기본 이미지 사용
  const imageSource = profileImage && profileImage.trim() !== "" ? profileImage : DEFAULT_PROFILE_IMAGE;
  
  return (
    <View aria-label="user-info" className="ml-6 mt-6 flex h-[60px] flex-row">
      <View className="size-[60px] overflow-hidden rounded-full">
        <Image source={imageSource} style={{ width: 60, height: 60 }} />
      </View>
      <View className="ml-2 h-full justify-center p-2">
        <Text className="mr-1 text-[16px]">{nickname || "사용자"}</Text>
      </View>
    </View>
  );
}
