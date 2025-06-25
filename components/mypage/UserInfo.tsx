import { useState } from "react";

import { useActionSheet } from "@expo/react-native-action-sheet";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { View, Text, Pressable } from "react-native";

import EditIcon from "@/components/icons/Edit";

export default function UserInfo() {
  const [profileUri, setProfileUri] = useState(
    "https://avatars.githubusercontent.com/u/156386797?v=4",
  );
  const { showActionSheetWithOptions } = useActionSheet();
  // TODO : 백엔드 서버에 관련 이미지 어떤식으로 전송할지 협의 필요
  const onPress = () => {
    const options = ["사진 가져오기", "사진 촬영", "Cancel"];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (selectedIndex: number) => {
        switch (selectedIndex) {
          case 0:
            const libraryResult = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: "images",
              allowsEditing: true,
              aspect: [1, 1],
              quality: 1,
            });
            if (!libraryResult.canceled) {
              setProfileUri(libraryResult.assets[0].uri);
            }
            break;
          case 1:
            console.log("camera");
            break;
          case cancelButtonIndex:
            // Canceled
            break;
        }
      },
    );
  };
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
