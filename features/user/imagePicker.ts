/**
 * TODO
 * 1. 백엔드와 어떤식으로 주고받을지
 * 2. 카메라 기능은 확인 제한. ios빌드하는 경우 애플 로그인 기능을 활용하고 있어 무료기능으로 확인 불가.
 * 3. 안드로이드는 정상 동작함을 확인했지만 permission에 대한 고민을 해야할듯.
 */

import { useState } from "react";

import { useActionSheet } from "@expo/react-native-action-sheet";
import * as ImagePicker from "expo-image-picker";

export default function useImagePicker() {
  const [profileUri, setProfileUri] = useState(
    "https://avatars.githubusercontent.com/u/156386797?v=4",
  );
  const { showActionSheetWithOptions } = useActionSheet();
  const onPress = () => {
    const options = ["사진 가져오기", "사진 촬영", "취소"];
    const cancelButtonIndex = 2;
    const title = "프로필 이미지 수정 방법을 선택해주세요.";

    showActionSheetWithOptions(
      {
        title,
        options,
        cancelButtonIndex,
      },
      async (selectedIndex?: number) => {
        if (selectedIndex === undefined) return;
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
            const cameraResult = await ImagePicker.launchCameraAsync({
              mediaTypes: "images",
              allowsEditing: true,
              aspect: [1, 1],
              quality: 1,
            });
            if (!cameraResult.canceled) {
              setProfileUri(cameraResult.assets[0].uri);
            }
            break;
          case cancelButtonIndex:
            // Canceled
            break;
        }
      },
    );
  };
  return {
    onPress,
    profileUri,
  };
}
