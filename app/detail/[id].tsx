import { useEffect, useRef, useState } from "react";

import { shareFeedTemplate } from "@react-native-kakao/share";
import axios from "axios";
import dayjs from "dayjs";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
  Linking,
  Platform,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BackArrow from "@/components/icons/BackArrow";
import CopyIcon from "@/components/icons/CopyIcon";
import HeartFilledIcon from "@/components/icons/HeartFilledIcon";
import HeartOutlineIcon from "@/components/icons/HeartOutlineIcon";
import LocationIcon from "@/components/icons/LocationIcon";
import LocationPinIcon from "@/components/icons/LocationPinIcon";
import ShareOutlineIcon from "@/components/icons/ShareOutlineIcon";
import NaverMap from "@/components/map/NaverMap";
import DatePickerBottomSheet from "@/components/schedule/DatePickerBottomSheet";
import Divider from "@/components/ui/Divider";
import { BACKEND_URL } from "@/constants/ApiUrls";
import { ensureMinLoadingTime } from "@/utils/loadingUtils";

function DetailImageCarousel({
  imageHeight,
  onImagePress,
}: {
  imageHeight: number;
  onImagePress: (index: number) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const carouselData = Array(5).fill({
    uri: "https://mfnmcpsoimdf9o2j.public.blob.vercel-storage.com/detail-dummy.png",
  });

  const renderCarouselItem = ({
    item,
    index,
  }: {
    item: any;
    index: number;
  }) => (
    <Pressable
      onPress={() => onImagePress(index)}
      style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
    >
      <Image
        source={item}
        className="w-full"
        style={{
          height: imageHeight,
          resizeMode: "cover",
        }}
      />
    </Pressable>
  );

  return (
    <View
      style={{
        height: imageHeight,
      }}
    >
      <Carousel
        width={Dimensions.get("window").width}
        height={imageHeight}
        data={carouselData}
        renderItem={renderCarouselItem}
        loop={true}
        scrollAnimationDuration={1000}
        onSnapToItem={(index) => setCurrentIndex(index)}
      />

      <View className="absolute bottom-8 right-4">
        <View className="rounded-full bg-black/50 px-2.5 py-0.5">
          <Text className="font-base text-sm text-[#F5F5F5]">
            {currentIndex + 1}/{carouselData.length}
          </Text>
        </View>
      </View>
    </View>
  );
}

const IMAGE_HEIGHT = 350;

interface ContentDetail {
  contentId: number;
  title: string;
  images: string[];
  tags: string[];
  placeName: string;
  startDate: string;
  endDate: string;
  likes: number;
  openingHour: string;
  closedHour: string;
  address: string;
  introduction: string;
  description: string;
  longitude: number;
  latitude: number;
  alwaysOpen: boolean;
}

export default function DetailScreen() {
  const [contentData, setContentData] = useState<ContentDetail | null>(null);
  const [scrollY, setScrollY] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLikeLoading, setIsLikeLoading] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);

  const scrollViewRef = useRef<ScrollView>(null);

  const router = useRouter();
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchContentDetail = async () => {
      const startTime = Date.now();

      try {
        setLoading(true);
        if (id) {
          const token = process.env.TOKEN;

          const response = await axios(`${BACKEND_URL}/contents/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.data.isSuccess) setContentData(response.data.result);
        }
      } catch (error) {
        console.error("API 호출 에러:", error);
      } finally {
        await ensureMinLoadingTime(startTime);
        setLoading(false);
      }
    };

    fetchContentDetail();
  }, [id]);

  const showHeaderBackground = scrollY > 150;

  // const handleKakaoShare = async () => {
  //   if (!contentData) return;

  //   try {
  //     await shareFeedTemplate({
  //       template: {
  //         content: {
  //           title: contentData.title,
  //           description: contentData.description,
  //           imageUrl:
  //             "https://mfnmcpsoimdf9o2j.public.blob.vercel-storage.com/detail-dummy.png",
  //           link: {
  //             webUrl: "https://github.com/",
  //             mobileWebUrl: "https://github.com/",
  //           },
  //         },
  //       },
  //     });
  //   } catch (error) {
  //     console.error("카카오톡 공유 오류:", error);
  //   }
  // };

  const handleGoBack = () => {
    router.back();
  };

  const handleCopyAddress = async () => {
    try {
      await Clipboard.setStringAsync(contentData!.address);
      console.log("주소가 복사되었습니다.");
    } catch (error) {
      console.error("복사 오류:", error);
    }
  };

  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    setScrollY(currentScrollY);
  };

  const handleLikeToggle = async () => {
    if (!id || isLikeLoading) return;

    setIsLikeLoading(true);

    try {
      const response = await axios.post(
        `${BACKEND_URL}/contents/${id}/favorites`,
      );

      if (response.data.isSuccess) {
        const { result: newLikesCount } = response.data;

        setIsLiked((prev) => !prev);
        setContentData((prev) =>
          prev
            ? {
                ...prev,
                likes: newLikesCount,
              }
            : null,
        );
      }
    } catch (error) {
      console.error("좋아요 오류:", error);
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleImagePress = (index: number) => {
    const imageUrls = [
      "https://mfnmcpsoimdf9o2j.public.blob.vercel-storage.com/detail-dummy.png",
      "https://mfnmcpsoimdf9o2j.public.blob.vercel-storage.com/detail-dummy.png",
    ];

    router.push({
      pathname: "/image-viewer",
      params: {
        initialIndex: index.toString(),
        images: JSON.stringify(imageUrls),
      },
    });
  };

  const handleAddToSchedule = () => {
    setIsDatePickerOpen(true);
  };

  const handleDatePickerClose = () => {
    setIsDatePickerOpen(false);
  };

  const handleDateSelect = (selectedDate: string) => {
    console.log("선택된 날짜:", selectedDate);
    // TODO: 여기에 선택된 날짜를 사용자 일정에 추가하는 API 호출 로직 구현
    // 예: addEventToCalendar(contentData.id, selectedDate);
    setIsDatePickerOpen(false);
  };

  const handleNaverMapPress = async () => {
    if (!contentData) return;

    const { latitude, longitude, placeName } = contentData;

    // 네이버 지도 URL scheme
    const naverMapScheme = `nmap://place?lat=${latitude}&lng=${longitude}&name=${encodeURIComponent(placeName)}&appname=${process.env.MYCODE_BUNDLE_IDENTIFIER}`;

    // 네이버 지도 앱 스토어 링크
    const naverMapStoreURL =
      Platform.OS === "ios"
        ? "https://itunes.apple.com/app/id311867728?mt=8" // iOS 앱 스토어
        : "market://details?id=com.nhn.android.nmap"; // Android 구글 플레이

    try {
      // 네이버 지도 앱이 설치되어 있는지 확인
      const supported = await Linking.canOpenURL(naverMapScheme);

      if (supported) {
        // 네이버 지도 앱으로 이동
        await Linking.openURL(naverMapScheme);
      } else {
        // 네이버 지도 앱이 설치되어 있지 않으면 앱 스토어로 이동
        await Linking.openURL(naverMapStoreURL);
      }
    } catch (error) {
      console.error("네이버 지도 연동 중 오류 발생:", error);
    }
  };

  return (
    <>
      {loading || !contentData ? (
        <View className="flex-1 items-center justify-center bg-white">
          <StatusBar
            barStyle="dark-content"
            backgroundColor="transparent"
            translucent
          />
          <ActivityIndicator size="large" color="#6C4DFF" />
        </View>
      ) : (
        <View className="flex-1 bg-white">
          <StatusBar
            barStyle={showHeaderBackground ? "dark-content" : "light-content"}
            backgroundColor="transparent"
            translucent
          />

          {/* 상단 고정 헤더 */}
          <View
            className={`absolute left-0 right-0 top-0 z-50 flex-row items-center justify-between px-4 pb-3 pt-20 ${
              showHeaderBackground
                ? "border-b-[0.5px] border-[#DCDEE3] bg-white"
                : "bg-transparent"
            }`}
          >
            <Pressable
              onPress={handleGoBack}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <BackArrow color={showHeaderBackground ? "#000" : "#fff"} />
            </Pressable>

            {showHeaderBackground && (
              <Text
                className={`flex-1 text-center text-lg font-semibold text-[#212121]`}
                numberOfLines={1}
              >
                {contentData.title}
              </Text>
            )}

            {/* <Pressable
              onPress={handleKakaoShare}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <ShareOutlineIcon
                size={28}
                color={showHeaderBackground ? "#000" : "#fff"}
              />
            </Pressable> */}
          </View>

          {/* 전체 스크롤 영역 */}
          <ScrollView
            ref={scrollViewRef}
            className="flex-1"
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            contentContainerStyle={{ paddingBottom: 80 + insets.bottom }}
          >
            {/* 상단 캐러셀 영역 */}
            <DetailImageCarousel
              imageHeight={IMAGE_HEIGHT}
              onImagePress={handleImagePress}
            />

            {/* 정보 영역 */}
            <View className="mt-[-20px] rounded-t-2xl bg-white pt-6">
              {/* 제목 섹션 */}
              <View className="mb-3 px-5">
                <View className="mb-3.5 flex-row items-center justify-between">
                  <View className="flex-1 gap-1 pr-4">
                    <Text className="text-xl font-semibold text-[#212121]">
                      {contentData.title}
                    </Text>
                    <Text className="text-[#424242]">
                      {contentData.placeName}
                    </Text>
                    <Text className="text-[#424242]">
                      {contentData.startDate && contentData.endDate
                        ? `${dayjs(contentData.startDate).format("YYYY.MM.DD")} - ${dayjs(contentData.endDate).format("YYYY.MM.DD")}`
                        : ""}
                    </Text>
                  </View>
                </View>

                <Pressable
                  className="h-[43px] flex-1 justify-center rounded border-[0.5px] border-gray-300 p-2.5"
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                >
                  <Text className="text-center font-medium text-black">
                    전시 홈페이지
                  </Text>
                </Pressable>
              </View>

              <Divider />

              {/* 정보 섹션 */}
              <View>
                <View className="my-5 flex-col gap-y-2 px-5">
                  <View className="flex-row items-center">
                    <Text className="w-20 font-semibold text-gray-800">
                      관람시간
                    </Text>
                    <Text className="text-sm text-gray-700">
                      {contentData.openingHour && contentData.closedHour
                        ? `${contentData.openingHour.substring(0, 5)}-${contentData.closedHour.substring(0, 5)}`
                        : ""}
                    </Text>
                  </View>

                  <View className="flex-row items-center">
                    <Text className="w-20 font-semibold text-gray-800">
                      전화번호
                    </Text>
                    <Text className="text-sm text-gray-700">031-770-3232</Text>
                  </View>

                  <View className="flex-row items-center">
                    <Text className="w-20 font-semibold text-gray-800">
                      주소
                    </Text>
                    <View className="flex-row flex-wrap items-center gap-x-1">
                      <Text className="text-sm text-gray-700">
                        {contentData.address}
                      </Text>
                      <Pressable
                        onPress={handleCopyAddress}
                        className="flex-row items-center"
                        style={({ pressed }) => [
                          { opacity: pressed ? 0.7 : 1 },
                        ]}
                      >
                        <CopyIcon size={14} />
                        <Text className="ml-1 text-xs text-blue-600">복사</Text>
                      </Pressable>
                    </View>
                  </View>

                  <View className="flex-row">
                    <Text className="mt-0.5 w-20 font-semibold text-gray-800">
                      행사소개
                    </Text>
                    <Text className="flex-1 text-sm text-gray-700">
                      {contentData.introduction}
                    </Text>
                  </View>
                </View>

                <Divider />

                <View className="my-5 px-5">
                  <Text className="mb-3 font-semibold text-gray-800">
                    행사내용
                  </Text>
                  <View className="flex-row flex-wrap gap-y-1">
                    <Text className="text-gray-700">
                      {contentData.description}
                    </Text>
                  </View>
                </View>

                <Divider height="h-2" bg="bg-[#F5F5F5]" />

                <View className="my-5 px-5">
                  <Text className="mb-4 text-lg font-semibold text-gray-800">
                    위치
                  </Text>

                  {/*네이버지도 컴포넌트*/}
                  <NaverMap
                    latitude={contentData.latitude}
                    longitude={contentData.longitude}
                  />

                  <View className="mb-3 flex-row items-center">
                    <LocationIcon size={16} />
                    <Text className="ml-1.5 flex-1 text-sm text-black">
                      {contentData.address}
                    </Text>
                  </View>

                  <Pressable
                    className="flex flex-row items-center justify-center rounded-lg border border-black py-3"
                    style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                    onPress={handleNaverMapPress}
                  >
                    <LocationPinIcon size={14} />
                    <Text className="ml-1.5 text-center font-medium text-black">
                      길찾기
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* 하단 고정 바 */}
          <View
            className="absolute bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white px-5 pt-3"
            style={{ paddingBottom: 12 + insets.bottom }}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-col items-center">
                <Pressable
                  className="items-center justify-center"
                  style={({ pressed }) => [
                    {
                      opacity: isLikeLoading ? 0.5 : pressed ? 0.7 : 1,
                    },
                  ]}
                  onPress={handleLikeToggle}
                  disabled={isLikeLoading}
                >
                  {isLiked ? (
                    <HeartFilledIcon size={28} />
                  ) : (
                    <HeartOutlineIcon size={28} />
                  )}
                </Pressable>
                <Text className="text-lg font-medium text-gray-700">
                  {contentData.likes}
                </Text>
              </View>

              <Pressable
                className="ml-4 h-[50px] flex-1 justify-center rounded-lg bg-[#6C4DFF] px-6"
                style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
                onPress={handleAddToSchedule}
              >
                <Text className="text-center text-lg font-semibold text-white">
                  내 일정에 추가
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* 날짜 선택 바텀 시트 */}
      {contentData && (
        <DatePickerBottomSheet
          isOpen={isDatePickerOpen}
          onClose={handleDatePickerClose}
          startDate={contentData.startDate}
          endDate={contentData.endDate}
          onDateSelect={handleDateSelect}
          eventTitle={contentData.title}
        />
      )}
    </>
  );
}
