import { Marquee } from "@animatereactnative/marquee";
import { Image } from "expo-image";
import { View } from "react-native";

import { LoginImageType } from "@/constants/LoginImages";

export default function LoginMarquee({
  imageList,
  direction,
}: {
  imageList: LoginImageType;
  direction: "down" | "up";
}) {
  const speed = direction === "down" ? -0.3 : 0.3;
  return (
    <Marquee direction="vertical" speed={speed} withGesture={false}>
      {imageList.map((imageInfo) => {
        const imageName = imageInfo[0];
        const imageSrc = imageInfo[1];
        return (
          <View
            key={imageName}
            className="my-2 flex h-[213px] w-[158px] items-center justify-center overflow-hidden rounded-[26px]"
          >
            <Image
              source={imageSrc}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
          </View>
        );
      })}
    </Marquee>
  );
}
