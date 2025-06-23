import { Marquee } from "@animatereactnative/marquee";
import { Image } from "expo-image";
import { View } from "react-native";

const images = [
  require("@/assets/images/login/apple_logo.png"),
  require("@/assets/images/login/kakao_logo.png"),
];

export default function LoginCardSlider() {
  return (
    <View className="flex flex-1 flex-row">
      <Marquee direction="vertical" speed={0.3} withGesture={false}>
        {images.map((src, index) => (
          <View
            key={index}
            className="my-2 flex h-[213px] w-[158px] items-center justify-center rounded-[26px] bg-gray-200"
          >
            <Image
              source={src}
              style={{ width: 100, height: 100 }}
              contentFit="contain"
            />
          </View>
        ))}
      </Marquee>
      <View className="m-2" />
      <Marquee direction="vertical" speed={-0.3} withGesture={false}>
        {images.map((src, index) => (
          <View
            key={index}
            className="my-2 flex h-[213px] w-[158px] items-center justify-center rounded-[26px] bg-gray-200"
          >
            <Image
              source={src}
              style={{ width: 100, height: 100 }}
              contentFit="contain"
            />
          </View>
        ))}
      </Marquee>
    </View>
  );
}
