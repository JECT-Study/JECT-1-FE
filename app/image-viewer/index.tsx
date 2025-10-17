import { useRef, useState } from "react";

import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import X from "@/components/icons/X";

interface ImageItem {
  uri: string;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

function CarouselItem({ item }: { item: ImageItem }) {
  return (
    <View className="flex-1 items-center justify-center">
      <Image
        source={item}
        className="h-full w-full"
        style={{
          resizeMode: "contain",
        }}
      />
    </View>
  );
}

function ThumbnailItem({
  item,
  index,
  currentIndex,
  onPress,
}: {
  item: ImageItem;
  index: number;
  currentIndex: number;
  onPress: (index: number) => void;
}) {
  const isSelected = index === currentIndex;

  return (
    <Pressable
      onPress={() => onPress(index)}
      className={`mx-1 h-16 w-16 overflow-hidden rounded ${
        isSelected && "border-2 border-white"
      }`}
    >
      <Image source={item} className="h-full w-full object-cover" />
    </Pressable>
  );
}

export default function ImageViewerScreen() {
  const carouselRef = useRef<ICarouselInstance>(null);

  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { initialIndex, images } = useLocalSearchParams();

  const [currentIndex, setCurrentIndex] = useState<number>(
    parseInt(initialIndex as string) || 0,
  );

  const imageList: ImageItem[] = (() => {
    if (images) {
      try {
        const parsedImages = JSON.parse(images as string);
        if (Array.isArray(parsedImages)) {
          return parsedImages.map((imageUrl: string) => ({ uri: imageUrl }));
        }
      } catch (error) {
        console.error("이미지 파싱 에러:", error);
      }
    }
    return [];
  })();

  const handleThumbnailPress = (index: number) => {
    setCurrentIndex(index);
    // 캐러셀을 해당 인덱스로 이동
    carouselRef.current?.scrollTo({ index, animated: true });
  };

  const handleClose = () => router.back();

  // 이미지가 없을 경우 처리
  if (imageList.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <StatusBar
          barStyle="light-content"
          backgroundColor="black"
          translucent
        />
        <View
          className="absolute left-0 right-0 top-0 z-50 flex-row items-center justify-between px-4 pb-2"
          style={{ paddingTop: insets.top + 10 }}
        >
          <Pressable
            onPress={handleClose}
            className="active:opacity-70"
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <X size={28} color="#fff" />
          </Pressable>
        </View>
        <Text className="text-lg text-white">이미지를 불러올 수 없습니다</Text>
      </View>
    );
  }

  return (
    <>
      <View className="flex-1 bg-black">
        <StatusBar
          barStyle="light-content"
          backgroundColor="black"
          translucent
        />

        <View
          className="absolute left-0 right-0 top-0 z-50 flex-row items-center justify-between px-4 pb-2"
          style={{ paddingTop: insets.top + 10 }}
        >
          <Pressable
            onPress={handleClose}
            className="active:opacity-70"
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <X size={28} color="#fff" />
          </Pressable>

          <Text className="text-lg font-medium text-white">
            {currentIndex + 1} / {imageList.length}
          </Text>

          <View className="w-8" />
        </View>

        <View className="flex-1 justify-center">
          <Carousel
            ref={carouselRef}
            width={screenWidth}
            height={screenHeight * 0.6}
            data={imageList}
            renderItem={({ item }: { item: ImageItem }) => (
              <CarouselItem item={item} />
            )}
            loop={false}
            defaultIndex={currentIndex}
            onSnapToItem={(index) => setCurrentIndex(index)}
            scrollAnimationDuration={300}
          />
        </View>

        <View
          className="absolute bottom-0 left-0 right-0 bg-black/80 pt-4"
          style={{ paddingBottom: insets.bottom }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-5 py-4"
            contentContainerStyle={{ alignItems: "center" }}
          >
            {imageList.map((item, index) => (
              <ThumbnailItem
                key={index}
                item={item}
                index={index}
                currentIndex={currentIndex}
                onPress={handleThumbnailPress}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    </>
  );
}
