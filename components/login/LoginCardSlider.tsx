import { View } from "react-native";

import LoginMarquee from "@/components/login/LoginMarquee";
import { loginImages } from "@/constants/LoginImages";

const images = Object.entries(loginImages);
const leftImages = images.splice(0, Math.floor(images.length / 2));

export default function LoginCardSlider() {
  return (
    <View className="flex flex-1 flex-row">
      <LoginMarquee imageList={leftImages} direction={"up"} />
      <View className="m-2" />
      <LoginMarquee imageList={images} direction={"down"} />
    </View>
  );
}
