import { Image } from "expo-image";
import { View, Text, Pressable } from "react-native";

import EditIcon from "@/components/icons/Edit";

// TODO : 이미지 주소가 백엔드로부터 url 형태로 날아온다는 가정
const profileLink = "https://avatars.githubusercontent.com/u/156386797?v=4";

export default function UserInfo() {
  return (
    <View aria-label="user-info" className="flex h-[60px] flex-row">
      <View className="ml-6 size-[60px] overflow-hidden rounded-full">
        <Image source={profileLink} style={{ width: 60, height: 60 }} />
      </View>
      <View className="ml-2 h-full justify-between p-2">
        <View className="flex flex-row items-center">
          <Text className="mr-1 text-[14px]">한지웅</Text>
          {/*TODO : 누르면 수정 로직 */}
          <Pressable onPress={() => console.log("press")}>
            <EditIcon />
          </Pressable>
        </View>
        <Text className="text-[14px]">wldnd2977@gmail.com</Text>
      </View>
    </View>
  );
}
