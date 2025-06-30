import { SafeAreaView } from "react-native";

import EditProfileHeader from "@/components/mypage/EditProfileHeader";
import EditProfileImage from "@/components/mypage/EditProfileImage";
import EditProfileNickname from "@/components/mypage/EditProfileNickname";

export default function EditProfile() {
  return (
    <SafeAreaView className="w-full flex-1 items-center bg-white">
      <EditProfileHeader />
      <EditProfileImage />
      <EditProfileNickname />
    </SafeAreaView>
  );
}
