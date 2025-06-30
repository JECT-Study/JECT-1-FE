import { Image } from "expo-image";
import { View, Text } from "react-native";

import {
  useProfileImageUri,
  useProfileNickname,
} from "@/stores/useEditProfileStore";

export default function UserInfo() {
  const profileUri = useProfileImageUri();
  const profileNickname = useProfileNickname();
  return (
    <View aria-label="user-info" className="ml-6 mt-6 flex h-[60px] flex-row">
      <View className="size-[60px] overflow-hidden rounded-full">
        <Image source={profileUri} style={{ width: 60, height: 60 }} />
      </View>
      <View className="ml-2 h-full justify-center p-2">
        <Text className="mr-1 text-[16px]">{profileNickname}</Text>
      </View>
    </View>
  );
}
