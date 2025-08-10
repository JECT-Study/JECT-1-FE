import { useActionSheet } from "@expo/react-native-action-sheet";
import * as ImagePicker from "expo-image-picker";

import { useSetTempImageUri } from "@/stores/useEditProfileStore";

export default function useImagePicker() {
  const setProfileImageFromPicker = useSetTempImageUri();
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
              quality: 0.8,
              allowsMultipleSelection: false,
            });
            if (!libraryResult.canceled) {
              setProfileImageFromPicker(libraryResult);
            }
            break;
          case 1:
            const cameraResult = await ImagePicker.launchCameraAsync({
              mediaTypes: "images",
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
              allowsMultipleSelection: false,
            });
            if (!cameraResult.canceled) {
              setProfileImageFromPicker(cameraResult);
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
  };
}
