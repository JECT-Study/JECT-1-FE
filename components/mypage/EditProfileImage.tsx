import { Image } from "expo-image";
import { Pressable, View } from "react-native";

import CameraIcon from "@/components/icons/CameraIcon";
import useImagePicker from "@/features/user/imagePicker";
import { useTempImageUri } from "@/stores/useEditProfileStore";

export default function EditProfileImage() {
  const { onPress } = useImagePicker();
  const profileUri = useTempImageUri();
  return (
    <View aria-label="edit profile" className="m-6">
      <View
        aria-label="profile_image"
        className="relative size-[94px] rounded-full"
      >
        <Image
          source={profileUri}
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
