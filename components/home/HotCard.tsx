import { useState } from "react";

import { useRouter } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

import { formatAddress } from "@/utils/addressUtils";

interface CustomContentItem {
  contentId: number;
  title: string;
  image: string;
  contentType: string;
  address: string;
  longitude: number;
  latitude: number;
  startDate: string;
  endDate: string;
}

const categoryConfig = [
  { id: "PERFORMANCE", iconType: "performance", label: "공연" },
  { id: "EXHIBITION", iconType: "exhibition", label: "전시" },
  { id: "FESTIVAL", iconType: "festival", label: "축제" },
  { id: "EVENT", iconType: "event", label: "행사" },
] as const;

export default function HotCard({ item }: { item: CustomContentItem }) {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);

  const handlePress = () => router.push(`/detail/${item.contentId}`);

  // contentType에 따른 라벨 매핑
  const getContentTypeLabel = (contentType: string) => {
    const categoryItem = categoryConfig.find(
      (config) => config.id === contentType,
    );
    return categoryItem ? categoryItem.label : "기타";
  };

  const hasImage = item.image && item.image.trim() !== "";
  const imageSource = hasImage
    ? { uri: item.image }
    : require("../../assets/images/content_placeholder.png");

  return (
    <Pressable className="w-[154px]" onPress={handlePress}>
      <View className="relative h-[154px] w-[154px] overflow-hidden rounded-[14px]">
        {hasImage ? (
          <>
            {/* Placeholder 이미지 - 항상 표시 */}
            <Image
              source={require("../../assets/images/content_placeholder.png")}
              className="absolute inset-0 h-full w-full rounded-[14px]"
              resizeMode="cover"
            />
            {/* API 이미지 - 로딩 완료 시 표시 */}
            <Image
              source={imageSource}
              className={`absolute inset-0 h-full w-full rounded-[14px] ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              resizeMode="cover"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(false)}
            />
          </>
        ) : (
          /* 이미지가 없는 경우 placeholder만 표시 */
          <Image
            source={imageSource}
            className="absolute inset-0 h-full w-full rounded-[14px]"
            resizeMode="cover"
          />
        )}
      </View>
      <View className="mt-2">
        <View className="mb-2 flex h-7 justify-center self-start rounded-full border border-[#E0E0E0] bg-white px-3">
          <Text className="text-sm font-medium text-[#707070]">
            {getContentTypeLabel(item.contentType)}
          </Text>
        </View>
        <Text
          className="mb-1.5 text-lg font-semibold text-[#424242]"
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text className="text-sm text-[#9E9E9E]" numberOfLines={1}>
          {formatAddress(item.address)}
        </Text>
      </View>
    </Pressable>
  );
}
