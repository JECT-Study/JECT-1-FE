import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import LoginCardSlider from "@/components/login/LoginCardSlider";
import SocialLoginButtons from "@/components/login/SocialLoginButtons";

export default function Login() {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="flex-1 items-center bg-white"
      style={{
        flex: 1,
        backgroundColor: "white",
        paddingTop: insets.top,
        paddingHorizontal: 16,
      }}
    >
      <LoginCardSlider />
      <SocialLoginButtons />
    </View>
  );
}
