import { View, Text } from "react-native";

import LoginCardSlider from "@/components/login/LoginCardSlider";
import SocialLoginButtons from "@/components/login/SocialLoginButtons";

export default function Login() {
  return (
    <View className="flex-1 items-center bg-black">
      <LoginCardSlider />
      <View className="items-center">
        <Text className="text-[34px] font-semibold text-white">마이코드</Text>
        <Text className="text-[18px] text-white">
          나에게 맞는 컨텐츠를 한눈에
        </Text>
      </View>
      <SocialLoginButtons />
    </View>
  );
}
