import { View } from "react-native";

import LoginCardSlider from "@/components/login/LoginCardSlider";
import SocialLoginButtons from "@/components/login/SocialLoginButtons";

export default function Login() {
  return (
    <View className="flex-1 items-center bg-black px-4">
      <LoginCardSlider />
      <SocialLoginButtons />
    </View>
  );
}
