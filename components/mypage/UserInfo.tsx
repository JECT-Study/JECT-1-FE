import { Image } from "expo-image";
import { View, Text, Pressable } from "react-native";

import EditIcon from "@/components/icons/Edit";
import useImagePicker from "@/features/user/imagePicker";
import { useSetNicknameModalState } from "@/stores/useModalStateStore";

export default function UserInfo() {
  const setIsOpen = useSetNicknameModalState();
  const { onPress, profileUri } = useImagePicker();
  return (
    <View aria-label="user-info" className="flex h-[60px] flex-row">
      <Pressable
        onPress={onPress}
        className="ml-6 size-[60px] overflow-hidden rounded-full"
      >
        <Image source={profileUri} style={{ width: 60, height: 60 }} />
      </Pressable>
      <View className="ml-2 h-full justify-between p-2">
        <View className="flex flex-row items-center">
          <Text className="mr-1 text-[14px]">한지웅</Text>
          <Pressable onPress={() => setIsOpen(true)}>
            <EditIcon />
          </Pressable>
        </View>
        <Text className="text-[14px]">wldnd2977@gmail.com</Text>
      </View>
    </View>
  );
}
