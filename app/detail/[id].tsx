import { useEffect, useRef, useState } from "react";

import { useActionSheet } from "@expo/react-native-action-sheet";
import { shareFeedTemplate } from "@react-native-kakao/share";
import dayjs from "dayjs";
import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BackArrow from "@/components/icons/BackArrow";
import CopyIcon from "@/components/icons/CopyIcon";
import HeartFilledIcon from "@/components/icons/HeartFilledIcon";
import HeartOutlineIcon from "@/components/icons/HeartOutlineIcon";
import LocationIcon from "@/components/icons/LocationIcon";
import LocationPinIcon from "@/components/icons/LocationPinIcon";
import AppleMap from "@/components/map/AppleMap";
import NaverMap from "@/components/map/NaverMap";
import DatePickerBottomSheet from "@/components/schedule/DatePickerBottomSheet";
import Divider from "@/components/ui/Divider";
import LoginPromptModal from "@/components/ui/LoginPromptModal";
import Toast from "@/components/ui/Toast";
import { BACKEND_URL } from "@/constants/ApiUrls";
import { authApi } from "@/features/axios/axiosInstance";
import { getImageSource } from "@/utils/imageUtils";
import { ensureMinLoadingTime } from "@/utils/loadingUtils";

const IMAGE_HEIGHT = 350;

interface ContentDetail {
  contentId: number;
  likeId: number | null;
  scheduleId: number | null;
  title: string;
  images: string[];
  tags: string[];
  placeName: string;
  startDate: string;
  endDate: string;
  likes: number;
  isAlwaysOpen: boolean;
  openingHour: string;
  closedHour: string;
  address: string;
  introduction: string;
  description: string;
  longitude: number;
  latitude: number;
}

export default function DetailScreen() {
  const [contentData, setContentData] = useState<ContentDetail | null>(null);
  const [scrollY, setScrollY] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLikeLoading, setIsLikeLoading] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false); // 찜 상태
  const [likeCount, setLikeCount] = useState<number | null>(null); // 좋아요 개수 (null이면 contentData.likes 사용)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // 로그인 상태
  const [showToast, setShowToast] = useState<boolean>(false);
  const [showCopyToast, setShowCopyToast] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false); // 로그인 모달 상태

  const scrollViewRef = useRef<ScrollView>(null);

  console.log(contentData);

  const router = useRouter();
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { showActionSheetWithOptions } = useActionSheet();

  // 토큰 확인을 통한 로그인 상태 체크 코드
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const accessToken = await SecureStore.getItemAsync("accessToken");
        const refreshToken = await SecureStore.getItemAsync("refreshToken");
        setIsLoggedIn(!!(accessToken && refreshToken));
      } catch (error) {
        console.error("토큰 확인 실패:", error);
        setIsLoggedIn(false);
      }
    };

    checkAuthStatus();
  }, []);

  useEffect(() => {
    const fetchContentDetail = async () => {
      const startTime = dayjs().valueOf();

      try {
        setLoading(true);
        if (id) {
          const response = await authApi.get(`${BACKEND_URL}/contents/${id}`);

          if (response.data.isSuccess) {
            const contentDetail = response.data.result;
            setContentData(contentDetail);
            // likeId가 있으면 좋아요 상태로 설정
            setIsLiked(contentDetail.likeId !== null);
            // 초기에는 likeCount를 null로 유지 (contentData.likes 사용)
          }
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

  const handleKakaoShare = async () => {
    if (!contentData) return;

    try {
      const appStoreUrl = "https://apps.apple.com/kr/app/mycode/id6751580479";
      const deepLinkUrl = `mycode://detail/${id}`;
      console.log("🚀 카카오 공유 딥링크:", deepLinkUrl);

      await shareFeedTemplate({
        template: {
          content: {
            title: contentData.title,
            description: contentData.description,
            imageUrl:
              getImageSource(contentData.contentId).uri ||
              "https://mfnmcpsoimdf9o2j.public.blob.vercel-storage.com/content_placeholder.png",
            link: {
              // 앱이 설치된 경우 딥링크로 이동
              mobileWebUrl: deepLinkUrl,
              webUrl: appStoreUrl,
              // 앱이 설치되지 않은 경우 앱스토어로 이동
              androidExecutionParams: { target: "detail", id: String(id) },
              iosExecutionParams: { target: "detail", id: String(id) },
            },
          },
          buttons: [
            {
              title: "자세히 보기",
              link: {
                mobileWebUrl: deepLinkUrl,
                webUrl: appStoreUrl,
                androidExecutionParams: { target: "detail", id: String(id) },
                iosExecutionParams: { target: "detail", id: String(id) },
              },
            },
          ],
        },
      });
    } catch (error) {
      console.error("카카오톡 공유 오류:", error);
      // 사용자에게 오류 메시지 표시
      Alert.alert("공유 실패", "카카오톡 공유 중 오류가 발생했습니다.");
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleCopyAddress = async () => {
    try {
      await Clipboard.setStringAsync(contentData!.address);
      setShowCopyToast(true);
      console.log("주소가 복사되었습니다.");
    } catch (error) {
      console.error("복사 오류:", error);
    }
  };

  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    setScrollY(currentScrollY);
  };

  // 찜하기 버튼 클릭 시 찜하기 상태 변경 함수
  const handleLikeToggle = async () => {
    if (!id || isLikeLoading || !contentData) return;

    setIsLikeLoading(true);

    // 현재 좋아요 상태를 미리 저장 (빠른 클릭 시 상태 일관성 보장)
    const currentIsLiked = isLiked;

    try {
      let response;

      // 현재 상태 기준으로 판단 (isLiked 상태 사용)
      if (!currentIsLiked) {
        // 좋아요 추가
        response = await authApi.post(
          `${BACKEND_URL}/contents/${id}/favorites`,
        );
      } else {
        // 좋아요 취소
        response = await authApi.delete(
          `${BACKEND_URL}/contents/${id}/favorites`,
        );
      }

      if (response.data.isSuccess) {
        const { result } = response.data;

        // 좋아요 추가 시: result = { likeId: number, likeCount: number }
        // 좋아요 취소 시: result = number (likeCount)
        const isAddAction = !currentIsLiked;
        const likeCount = isAddAction ? result.likeCount : result;
        const likeId = isAddAction ? result.likeId : null;

        // UI 상태 업데이트
        setIsLiked(!currentIsLiked);
        setLikeCount(likeCount); // API 응답의 likeCount 사용
        setContentData((prev) =>
          prev
            ? {
                ...prev,
                likeId: likeId,
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

  // const handleImagePress = (index: number) => {
  //   const imageUrls = [
  //     "https://mfnmcpsoimdf9o2j.public.blob.vercel-storage.com/content_placeholder.png",
  //     "https://mfnmcpsoimdf9o2j.public.blob.vercel-storage.com/content_placeholder.png",
  //   ];

  //   router.push({
  //     pathname: "/image-viewer",
  //     params: {
  //       initialIndex: index.toString(),
  //       images: JSON.stringify(imageUrls),
  //     },
  //   });
  // };

  const handleAddToSchedule = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else if (contentData?.scheduleId === null) {
      setIsDatePickerOpen(true);
    }
  };

  const handleDatePickerClose = () => {
    setIsDatePickerOpen(false);
  };

  // 일정 추가 성공 시 호출되는 콜백
  const handleScheduleAdded = (scheduleId: number) => {
    // contentData의 scheduleId 업데이트
    setContentData((prev) => (prev ? { ...prev, scheduleId } : null));
    // 토스트 표시
    setShowToast(true);
  };

  // 토스트 숨김 핸들러
  const handleToastHide = () => {
    setShowToast(false);
  };

  // 복사 토스트 숨김 핸들러
  const handleCopyToastHide = () => {
    setShowCopyToast(false);
  };

  const openAppleMaps = async () => {
    if (!contentData) return;
    const { latitude, longitude, placeName } = contentData;
    const appleMapsUrl = `maps://?q=${encodeURIComponent(placeName)}&ll=${latitude},${longitude}`;

    try {
      const supported = await Linking.canOpenURL(appleMapsUrl);
      if (supported) {
        await Linking.openURL(appleMapsUrl);
      } else {
        // Apple Maps가 설치되어 있지 않으면 앱 스토어로 이동
        const appStoreUrl = "https://apps.apple.com/app/id915056765";
        await Linking.openURL(appStoreUrl);
      }
    } catch (error) {
      console.error("Apple Maps 연동 중 오류 발생:", error);
    }
  };

  const openNaverMap = async () => {
    if (!contentData) return;
    const { latitude, longitude, placeName } = contentData;
    const naverMapScheme = `nmap://place?lat=${latitude}&lng=${longitude}&name=${encodeURIComponent(placeName)}&appname=${process.env.MYCODE_BUNDLE_IDENTIFIER}`;

    try {
      const supported = await Linking.canOpenURL(naverMapScheme);
      if (supported) {
        await Linking.openURL(naverMapScheme);
      } else {
        // 네이버 지도 앱이 설치되어 있지 않으면 스토어로 이동
        const storeURL =
          Platform.OS === "ios"
            ? "https://itunes.apple.com/app/id311867728?mt=8"
            : "https://play.google.com/store/apps/details?id=com.nhn.android.nmap";
        await Linking.openURL(storeURL);
      }
    } catch (error) {
      console.error("네이버 지도 연동 중 오류 발생:", error);
    }
  };

  const handleNaverMapPress = () => {
    if (!contentData) return;

    if (Platform.OS === "ios") {
      // iOS: ActionSheet로 지도 앱 선택
      const options = ["Apple 지도", "네이버 지도", "취소"];
      const cancelButtonIndex = 2;

      showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
          title: "지도 앱 선택",
          message: "길찾기에 사용할 지도 앱을 선택해주세요",
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            openAppleMaps();
          } else if (buttonIndex === 1) {
            openNaverMap();
          }
        },
      );
    } else {
      // Android: 네이버 지도만 사용
      openNaverMap();
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
            {/* 왼쪽 BackArrow */}
            <Pressable
              onPress={handleGoBack}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <BackArrow color={showHeaderBackground ? "#000" : "#fff"} />
            </Pressable>

            {/* 중앙 제목 텍스트 */}
            {showHeaderBackground && (
              <Text
                className="text-lg font-semibold text-[#212121]"
                numberOfLines={1}
                style={{ maxWidth: "60%" }}
              >
                {contentData.title}
              </Text>
            )}

            {/* 오른쪽 공유 버튼 */}
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
            {/* <DetailImageCarousel
              imageHeight={IMAGE_HEIGHT}
              onImagePress={handleImagePress}
            /> */}

            {/* 임시 상단 이미지 영역 */}
            <Image
              source={getImageSource(contentData.contentId)}
              className="w-full"
              style={{
                height: IMAGE_HEIGHT,
                resizeMode: "cover",
              }}
            />

            {/* 대표 정보 영역 */}
            <View className="mt-[-20px] rounded-t-2xl bg-white px-4 pt-6">
              <View className="mb-3.5 flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-2xl font-semibold text-[#212121]">
                    {contentData.title}
                  </Text>
                  <Text className="mt-1 text-lg font-medium text-[#424242]">
                    {contentData.placeName}
                  </Text>
                  <Text className="mt-3.5 text-lg text-[#424242]">
                    {contentData.description}
                  </Text>
                </View>
              </View>

              <Divider />

              {/* 상세 정보 섹션 */}
              <View>
                <View className="my-6 flex-col gap-y-2">
                  <View className="flex-row items-center">
                    <Text className="w-24 text-base font-medium text-gray-600">
                      기간
                    </Text>
                    <Text className="flex-1 pr-4 text-base text-gray-600">
                      {contentData.startDate && contentData.endDate
                        ? `${dayjs(contentData.startDate).format("YYYY.MM.DD")} - ${dayjs(contentData.endDate).format("YYYY.MM.DD")}`
                        : ""}
                    </Text>
                  </View>

                  <View className="flex-row items-center">
                    <Text className="w-24 text-base font-medium text-gray-600">
                      주소
                    </Text>
                    <View className="flex-row flex-wrap items-center gap-x-1">
                      <Text className="pr-4 text-base text-gray-600">
                        {contentData.address}
                      </Text>
                      <Pressable
                        onPress={handleCopyAddress}
                        className="flex-row items-center"
                        style={({ pressed }) => [
                          { opacity: pressed ? 0.7 : 1 },
                        ]}
                      >
                        <CopyIcon />
                        <Text className="ml-1 text-base text-[#186ADE]">
                          복사
                        </Text>
                      </Pressable>
                    </View>
                  </View>

                  <View className="flex-row items-center">
                    <Text className="w-24 text-base font-medium text-gray-600">
                      관람시간
                    </Text>
                    <Text className="flex-1 pr-4 text-base text-gray-600">
                      {contentData.isAlwaysOpen
                        ? "24시간 운영"
                        : contentData.openingHour && contentData.closedHour
                          ? `${contentData.openingHour.substring(0, 5)}-${contentData.closedHour.substring(0, 5)}`
                          : ""}
                    </Text>
                  </View>

                  <View className="flex-row items-center">
                    <Text className="w-24 text-base font-medium text-gray-600">
                      전화번호
                    </Text>
                    {/* 전화번호 데이터 없어서 임시 주석 처리 */}
                    {/* <Text className="flex-1 pr-4 text-base text-gray-600">
                      031-770-3232
                    </Text> */}
                    <Text className="text-base text-gray-600">-</Text>
                  </View>

                  <View className="flex-row items-center">
                    <Text className="w-24 text-base font-medium text-gray-600">
                      링크
                    </Text>
                    {/* 링크 데이터 없어서 임시 주석 처리 */}
                    {/* <Pressable
                      className="rounded border border-gray-300 bg-white px-2 py-1"
                      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                      onPress={() => {
                        // 링크 클릭 처리 로직
                        console.log("전시 홈페이지 링크 클릭");
                      }}
                    >
                      <Text className="text-sm text-gray-700">
                        전시 홈페이지
                      </Text>
                    </Pressable> */}
                    <Text className="text-base text-gray-600">-</Text>
                  </View>

                  <View className="flex-row">
                    <Text className="w-24 text-base font-medium text-gray-600">
                      행사내용
                    </Text>
                    <Text className="flex-1 pr-4 text-base text-gray-600">
                      {contentData.introduction}
                    </Text>
                  </View>
                </View>

                <Divider className="mb-4" />

                <View className="my-6">
                  <Text className="mb-4 text-xl font-semibold text-gray-800">
                    컨텐츠 키워드
                  </Text>
                  {/* 더미 데이터 임시 표시 */}
                  <View className="flex-row flex-wrap gap-2">
                    {[
                      "혼자 휴식",
                      "조용한 휴식",
                      "오감체험",
                      "가족이랑",
                      "감성가득",
                    ].map((tag, index) => (
                      <View
                        key={index}
                        className="rounded-md border border-gray-300 bg-white px-2 py-1"
                      >
                        <Text className="text-sm text-gray-700">#{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View className="my-5">
                  <Text className="mb-4 text-xl font-semibold text-gray-800">
                    위치
                  </Text>

                  {/*지도 컴포넌트 - iOS는 AppleMap, Android는 NaverMap*/}
                  {Platform.OS === "ios" ? (
                    <AppleMap
                      latitude={contentData.latitude}
                      longitude={contentData.longitude}
                    />
                  ) : (
                    <NaverMap
                      latitude={contentData.latitude}
                      longitude={contentData.longitude}
                    />
                  )}

                  <View className="my-3 flex-row items-center">
                    <LocationIcon size={18} />
                    <Text className="ml-1.5 text-base text-black">
                      {contentData.address}
                    </Text>
                  </View>

                  <Pressable
                    className="flex flex-row items-center justify-center rounded-lg border border-black py-3"
                    style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                    onPress={handleNaverMapPress}
                  >
                    <LocationPinIcon size={16} />
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
            className="absolute bottom-0 left-0 right-0 border-t border-[#E5E5E5] bg-white px-5 pt-3"
            style={{ paddingBottom: 12 + insets.bottom }}
          >
            <View className="flex-row items-center justify-between gap-x-4">
              <View className="flex-col items-center">
                <Pressable
                  className="items-center justify-center"
                  style={({ pressed }) => [
                    {
                      opacity:
                        !isLoggedIn || isLikeLoading ? 0.5 : pressed ? 0.7 : 1,
                    },
                  ]}
                  onPress={handleLikeToggle}
                  disabled={!isLoggedIn || isLikeLoading}
                >
                  {isLiked ? (
                    <HeartFilledIcon
                      size={28}
                      color={!isLoggedIn ? "#E0E0E0" : undefined}
                    />
                  ) : (
                    <HeartOutlineIcon
                      size={28}
                      color={!isLoggedIn ? "#E0E0E0" : undefined}
                    />
                  )}
                </Pressable>
                <Text
                  className="text-sm"
                  style={{ color: !isLoggedIn ? "#E0E0E0" : "#111111" }}
                >
                  {likeCount !== null ? likeCount : contentData?.likes || 0}
                </Text>
              </View>

              <Pressable
                className={`h-[50px] flex-1 justify-center rounded-lg px-6 ${
                  isLoggedIn && contentData.scheduleId === null
                    ? "bg-[#6C4DFF]"
                    : contentData.scheduleId !== null
                      ? "bg-gray-300"
                      : "bg-[#6C4DFF]"
                }`}
                style={({ pressed }) => [
                  {
                    opacity:
                      contentData.scheduleId !== null ? 0.6 : pressed ? 0.9 : 1,
                  },
                ]}
                onPress={handleAddToSchedule}
                disabled={contentData.scheduleId !== null}
              >
                <Text className="text-center text-lg font-semibold text-white">
                  {contentData.scheduleId !== null
                    ? "이미 추가됨"
                    : "내 일정에 추가"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* 날짜 선택 바텀 시트 오버레이 */}
      {isDatePickerOpen && (
        <Pressable
          className="absolute inset-0 z-0 flex-1 items-center justify-center bg-black/50"
          onPress={handleDatePickerClose}
        />
      )}

      {/* 날짜 선택 바텀 시트 */}
      {contentData && contentData.startDate && contentData.endDate && (
        <DatePickerBottomSheet
          isOpen={isDatePickerOpen}
          onClose={handleDatePickerClose}
          startDate={contentData.startDate}
          endDate={contentData.endDate}
          eventTitle={contentData.title}
          contentId={id as string}
          onScheduleAdded={handleScheduleAdded}
        />
      )}

      {/* 일정 토스트 */}
      <Toast
        visible={showToast}
        message="일정에 추가되었습니다."
        onHide={handleToastHide}
      />

      {/* 복사 토스트 */}
      <Toast
        visible={showCopyToast}
        message="주소가 복사되었습니다."
        onHide={handleCopyToastHide}
      />

      {/* 로그인 안내 모달 */}
      <LoginPromptModal
        visible={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}
