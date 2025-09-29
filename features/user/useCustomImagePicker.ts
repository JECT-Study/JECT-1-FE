import { useState } from "react";

import * as ImagePicker from "expo-image-picker";

import { useSetTempImageUri } from "@/stores/useEditProfileStore";

export default function useCustomImagePicker() {
  const setProfileImageFromPicker = useSetTempImageUri();
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const onPress = () => {
    setIsBottomSheetOpen(true);
  };

  const onCloseBottomSheet = () => {
    setIsBottomSheetOpen(false);
  };

  const onLibrary = async () => {
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
  };

  return {
    onPress,
    isBottomSheetOpen,
    onCloseBottomSheet,
    onLibrary,
  };
}
