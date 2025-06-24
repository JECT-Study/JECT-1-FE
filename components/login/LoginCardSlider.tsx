import { Marquee } from "@animatereactnative/marquee";
import { Image } from "expo-image";
import { View } from "react-native";

import { loginImages } from "@/constants/LoginImages";

const images = Object.entries(loginImages);

export default function LoginCardSlider() {
  return (
    <View className="flex flex-1 flex-row">
      <Marquee direction="vertical" speed={0.3} withGesture={false}>
        {images.map((imageInfo) => {
          const imageName = imageInfo[0];
          const imageSrc = imageInfo[1];
          return (
            <View
              key={imageInfo[0]}
              className="my-2 flex h-[213px] w-[158px] items-center justify-center overflow-hidden rounded-[26px] bg-gray-200"
            >
              <Image
                source={imageInfo[1]}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
            </View>
          );
        })}
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
