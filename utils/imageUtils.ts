import { dummyImages } from "@/utils/dummyImages";

// contentId에 따른 이미지 매칭 헬퍼 함수
export const getImageSource = (contentId: number) => {
  const imageItem = dummyImages.find((img) => img.id === contentId);
  return imageItem
    ? { uri: imageItem.image }
    : require("../assets/images/content_placeholder.png");
};
