import { useCallback, useEffect, useState } from "react";

import { useFocusEffect } from "@react-navigation/native";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { setStatusBarStyle } from "expo-status-bar";
import {
  ActivityIndicator,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

import Card from "@/components/home/Card";
import HotCard from "@/components/home/HotCard";
import MoreCard from "@/components/home/MoreCard";
import WeeklyCard from "@/components/home/WeeklyCard";
import ChevronRight from "@/components/icons/ChevronRight";
import { EventIcon } from "@/components/icons/EventIcon";
import { ExhibitionIcon } from "@/components/icons/ExhibitionIcon";
import { FestivalIcon } from "@/components/icons/FestivalIcon";
import LockWithSparkles from "@/components/icons/LockWithSparkles";
import { LogoIcon } from "@/components/icons/LogoIcon";
import { PerformanceIcon } from "@/components/icons/PerformanceIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import { BACKEND_URL } from "@/constants/ApiUrls";
import { authApi, publicApi } from "@/features/axios/axiosInstance";
import useUserStore from "@/stores/useUserStore";
import { ensureMinLoadingTime } from "@/utils/loadingUtils";
import { mapUserRegionNameToKey } from "@/utils/searchUtils";

// dayjs 한국어 로케일 설정
dayjs.locale("ko");

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

interface WeeklyContentItem {
  contentId: number;
  title: string;
  image: string | null;
  address: string;
  startDate: string;
  endDate: string;
}

interface CategoryContentItem {
  contentId: number;
  title: string;
  image: string | null;
  longitude: number;
  latitude: number;
  startDate: string;
  endDate: string;
}

type CategoryType = (typeof categoryConfig)[number]["id"];

const categoryConfig = [
  { id: "PERFORMANCE", iconType: "performance", label: "공연" },
  { id: "EXHIBITION", iconType: "exhibition", label: "전시" },
  { id: "FESTIVAL", iconType: "festival", label: "축제" },
  { id: "EVENT", iconType: "event", label: "행사" },
] as const;

const SCROLL_THRESHOLD = 20;

const chunkArray = <T,>(array: T[], chunkSize: number): T[][] => {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

const getWeekDays = () => {
  const today = dayjs();

  // 오늘부터 7일간의 연속된 날짜 생성
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = today.add(i, "day");
    return {
      dayOfIndex: i,
      date: day.format("D"),
      dayName: day.format("ddd"),
      fullDate: day.format("YYYY-MM-DD"),
      isToday: i === 0, // 첫 번째 날짜가 항상 오늘
    };
  });

  return weekDays;
};

export default function HomeScreen() {
  const [selectedRecommendationsCategory, setSelectedRecommendationsCategory] =
    useState<CategoryType>("PERFORMANCE");
  const [selectedWeekDayIndex, setSelectedWeekDayIndex] = useState<number>(0); // 오늘이 첫 번째(인덱스 0)에 위치
  const [recommendationsData, setRecommendationsData] = useState<
    CustomContentItem[]
  >([]);
  const [hotFestivalData, setHotFestivalData] = useState<CustomContentItem[]>(
    [],
  );
  const [weekDayData, setWeekDayData] = useState<WeeklyContentItem[]>([]);
  const [categoryContentData, setCategoryContentData] = useState<
    CategoryContentItem[]
  >([]);

  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isLoadingRecommendations, setIsLoadingRecommendations] =
    useState<boolean>(false);
  const [isLoadingHotFestival, setIsLoadingHotFestival] =
    useState<boolean>(false);
  const [isLoadingWeekDay, setIsLoadingWeekDay] = useState<boolean>(false);
  const [isLoadingCategoryContent, setIsLoadingCategoryContent] =
    useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const { nickname, userRegions } = useUserStore();

  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      // StatusBar 스타일을 light로 설정
      setStatusBarStyle("light");

      const checkLoginStatus = async () => {
        try {
          const accessToken = await SecureStore.getItemAsync("accessToken");
          const refreshToken = await SecureStore.getItemAsync("refreshToken");

          if (accessToken && refreshToken) {
            setIsLoggedIn(true);

            // nickname과 userRegions를 SecureStore에서 불러와서 Store에 설정
            const storedNickname = await SecureStore.getItemAsync("nickname");
            const storedUserRegions =
              await SecureStore.getItemAsync("userRegions");

            const { setNickname, setUserRegions } =
              useUserStore.getState().action;

            if (storedNickname) {
              setNickname(storedNickname);
            }
            if (storedUserRegions) {
              setUserRegions(JSON.parse(storedUserRegions));
            }
          } else {
            setIsLoggedIn(false);
          }
        } catch (error) {
          console.log("❌ 토큰 확인 중 에러:", error);
          setIsLoggedIn(false);
        }
      };

      checkLoginStatus();
    }, []),
  );

  const weekDays = getWeekDays();

  const chunkedRecommendationsData = chunkArray(recommendationsData, 3);
  const chunkedFilteredContentData = chunkArray(weekDayData, 3);

  const fetchRecommendationsByCategory = useCallback(
    async (category: CategoryType, skipLoading = false) => {
      const startTime = dayjs().valueOf();

      try {
        if (!skipLoading) {
          setIsLoadingRecommendations(true);
        }

        const response = await authApi.get(
          `${BACKEND_URL}/home/recommendations?category=${category}`,
        );

        if (response.data.isSuccess && response.data.result) {
          setRecommendationsData(response.data.result);
        }
      } catch (error) {
        console.error(error);

        // 에러 시 빈 배열로 설정
        setRecommendationsData([]);
      } finally {
        if (!skipLoading) {
          // 최소 0.2초 보장
          await ensureMinLoadingTime(startTime);
          setIsLoadingRecommendations(false);
        }
      }
    },
    [],
  );

  const fetchHotFestivalData = useCallback(async (skipLoading = false) => {
    const startTime = dayjs().valueOf();

    try {
      if (!skipLoading) {
        setIsLoadingHotFestival(true);
      }

      const response = await publicApi.get(`${BACKEND_URL}/home/festival/hot`);

      if (response.data.isSuccess && response.data.result) {
        setHotFestivalData(response.data.result);
      }
    } catch (error) {
      console.error(error);
      setHotFestivalData([]);
    } finally {
      if (!skipLoading) {
        // 최소 0.2초 보장
        await ensureMinLoadingTime(startTime);
        setIsLoadingHotFestival(false);
      }
    }
  }, []);

  const fetchWeeklyContentData = useCallback(
    async (dateIndex: number, skipLoading = false) => {
      const startTime = dayjs().valueOf();

      try {
        if (!skipLoading) {
          setIsLoadingWeekDay(true);
        }

        const weekDays = getWeekDays();
        const selectedDayData = weekDays.find(
          (day) => day.dayOfIndex === dateIndex,
        );
        if (!selectedDayData) {
          // early return시에도 최소 0.2초 보장
          if (!skipLoading) {
            await ensureMinLoadingTime(startTime);
            setIsLoadingWeekDay(false);
          }
          return;
        }

        const response = await publicApi.get(
          `${BACKEND_URL}/home/contents/week?date=${selectedDayData.fullDate}`,
        );

        if (response.data.isSuccess && response.data.result) {
          setWeekDayData(response.data.result);
        }
      } catch (error) {
        console.error(error);
        setWeekDayData([]);
      } finally {
        if (!skipLoading) {
          // 최소 0.2초 보장
          await ensureMinLoadingTime(startTime);
          setIsLoadingWeekDay(false);
        }
      }
    },
    [],
  );

  const fetchCategoryContentData = useCallback(async (skipLoading = false) => {
    const startTime = dayjs().valueOf();

    try {
      if (!skipLoading) {
        setIsLoadingCategoryContent(true);
      }

      const response = await publicApi.get(`${BACKEND_URL}/home/category`);

      if (response.data.isSuccess && response.data.result) {
        setCategoryContentData(response.data.result);
      }
    } catch (error) {
      console.error(error);
      setCategoryContentData([]);
    } finally {
      if (!skipLoading) {
        // 최소 0.2초 보장
        await ensureMinLoadingTime(startTime);
        setIsLoadingCategoryContent(false);
      }
    }
  }, []);

  // 초기 API 호출
  useEffect(() => {
    Promise.all([
      fetchRecommendationsByCategory("PERFORMANCE"),
      fetchHotFestivalData(),
      fetchWeeklyContentData(0),
      fetchCategoryContentData(),
    ]);
  }, [
    fetchRecommendationsByCategory,
    fetchHotFestivalData,
    fetchWeeklyContentData,
    fetchCategoryContentData,
  ]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      fetchRecommendationsByCategory(selectedRecommendationsCategory, true),
      fetchHotFestivalData(true),
      fetchWeeklyContentData(selectedWeekDayIndex, true),
      fetchCategoryContentData(true),
    ]);
    setRefreshing(false);
  }, [
    selectedRecommendationsCategory,
    selectedWeekDayIndex,
    fetchRecommendationsByCategory,
    fetchHotFestivalData,
    fetchWeeklyContentData,
    fetchCategoryContentData,
  ]);

  // 카테고리 버튼 클릭 핸들러
  const handleCategoryButtonPress = useCallback(
    (categoryId: CategoryType) => {
      setSelectedRecommendationsCategory(categoryId);
      fetchRecommendationsByCategory(categoryId);
    },
    [fetchRecommendationsByCategory],
  );

  // 날짜 버튼 클릭 핸들러
  const handleDateButtonPress = useCallback(
    (dayOfIndex: number) => {
      setSelectedWeekDayIndex(dayOfIndex);
      fetchWeeklyContentData(dayOfIndex);
    },
    [fetchWeeklyContentData],
  );

  const handleScrollStateChange = (
    e: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const { contentOffset } = e.nativeEvent;
    // 현재 스크롤 위치 (Y축)
    const currentScrollY = contentOffset.y;

    // 스크롤 헤더 표시 여부 결정 (SCROLL_THRESHOLD 이상 스크롤 시 헤더 표시)
    setIsScrolled(currentScrollY > SCROLL_THRESHOLD);
  };

  const handleSearchPress = () => {
    // userRegions가 있으면 첫 번째 지역을 region 파라미터로 전달
    if (userRegions && userRegions.length > 0) {
      const firstRegionKey = mapUserRegionNameToKey(userRegions[0].name);
      router.push({
        pathname: "/search-results",
        params: {
          keyword: "",
          category: "ALL",
          region: firstRegionKey,
        },
      });
    } else {
      router.push("/search-results");
    }
  };

  const handleSchedulePress = () => router.push("/(tabs)/schedule");

  return (
    <View className="flex-1 bg-white">
      {/* 기본 헤더 - 고정 */}
      <LinearGradient
        colors={["#816BFF", "#5E47E3"]}
        start={{ x: 0, y: 0.14 }}
        end={{ x: 1, y: 0.86 }}
        locations={[0.0682, 0.9458]}
      >
        <View
          className={`flex-row items-end justify-center px-[18px] pb-20 ${
            Platform.OS === "web" ? "pt-10" : "h-52"
          }`}
        >
          <View className="w-full flex-row items-center gap-x-2">
            <LogoIcon width={35} height={32} />
            <Pressable
              className="h-11 flex-1 flex-row items-center justify-between rounded-full bg-white px-[18px] py-3"
              onPress={handleSearchPress}
            >
              <Text className="text-[#6E6E6E]">
                이번 주말, 뭐 할지 검색해 볼까?
              </Text>
              <SearchIcon size={24} color="#6B51FB" />
            </Pressable>
          </View>
        </View>
      </LinearGradient>

      <View
        className={`mt-[-55px] flex-1 ${!isScrolled ? "rounded-t-3xl" : ""}`}
      >
        <ScrollView
          className={`bg-white ${!isScrolled ? "rounded-t-3xl" : ""}`}
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
          onScroll={handleScrollStateChange}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#6C4DFF"
              colors={["#6C4DFF"]}
            />
          }
        >
          {/* 카테고리 버튼 */}
          <View className="mb-7 px-6 pt-6">
            <View className="flex-row items-center justify-center gap-x-6">
              {categoryConfig.map((item) => (
                <Pressable
                  className="gap-y-1"
                  key={item.id}
                  onPress={() => {
                    router.push({
                      pathname: "/search-results",
                      params: {
                        keyword: "",
                        category: item.id,
                        region: "ALL",
                      },
                    });
                  }}
                >
                  <View className="flex h-20 w-20 items-center justify-center rounded-[14px] bg-[#F5F5F5]">
                    {item.iconType === "performance" && (
                      <PerformanceIcon width={55} height={55} />
                    )}
                    {item.iconType === "exhibition" && (
                      <ExhibitionIcon width={72} height={72} />
                    )}
                    {item.iconType === "festival" && (
                      <View className="mt-[-8px]">
                        <FestivalIcon width={52} height={52} />
                      </View>
                    )}
                    {item.iconType === "event" && (
                      <EventIcon width={70} height={70} />
                    )}
                  </View>
                  <Text className="text-center text-base text-[#424242]">
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View className="gap-y-[34px]">
            {/* 맞춤 콘텐츠 */}
            <View className="relative py-2.5">
              <Text className="px-[18px] text-xl font-semibold text-[#424242]">
                {isLoggedIn && nickname
                  ? `${nickname}님을 위한 맞춤 콘텐츠`
                  : "맞춤 콘텐츠"}
              </Text>

              <View className="mb-5 mt-2 flex-row gap-x-2.5 px-[18px]">
                {categoryConfig.map((category) => {
                  const isSelected =
                    selectedRecommendationsCategory === category.id;
                  const isDisabled = !isLoggedIn;

                  return (
                    <Pressable
                      key={category.id}
                      disabled={isDisabled}
                      className={`flex h-9 w-14 items-center justify-center rounded-full border border-[#6C4DFF] ${
                        isSelected ? "bg-[#6C4DFF]" : "bg-white"
                      }`}
                      onPress={() => {
                        if (!isDisabled) handleCategoryButtonPress(category.id);
                      }}
                    >
                      <Text
                        className={`text-base ${
                          isSelected ? "text-white" : "text-[#6C4DFF]"
                        }`}
                      >
                        {category.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {isLoadingRecommendations ? (
                <View className="h-[333px] w-full items-center justify-center">
                  <ActivityIndicator size="large" color="#6C4DFF" />
                </View>
              ) : (
                <FlatList
                  data={chunkedRecommendationsData}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingHorizontal: 18,
                  }}
                  renderItem={({ item }) => (
                    <View className="w-[287px] flex-1 gap-y-[15.5px]">
                      {item.map((cardItem) => (
                        <Card
                          key={cardItem.contentId.toString()}
                          item={cardItem}
                        />
                      ))}
                    </View>
                  )}
                  keyExtractor={(_, index) => index.toString()}
                  ItemSeparatorComponent={() => <View className="w-3.5" />}
                />
              )}

              {(!isLoggedIn || (isLoggedIn && userRegions.length === 0)) && (
                <BlurView
                  intensity={8}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <View className="absolute inset-0 bg-white/95" />
                  <View className="items-center gap-y-3">
                    <LockWithSparkles width={144} height={117} />
                    <View>
                      <Text className="text-center text-xl font-semibold text-gray-800">
                        이 공간은 잠시 비공개예요!
                      </Text>
                      <Text className="text-center text-lg text-gray-600">
                        내게 꼭 맞는 전시, 취향 분석하면 바로 보여드려요.
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => {
                        if (!isLoggedIn) {
                          router.dismissAll();
                          router.push("/");
                        } else {
                          router.push("/survey");
                        }
                      }}
                    >
                      <LinearGradient
                        colors={["#7F69FE", "#6B52FB"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        locations={[0.0073, 0.9927]}
                        style={{
                          borderRadius: 20,
                          paddingHorizontal: 10,
                          paddingVertical: 6,
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6,
                        }}
                      >
                        <Text className="text-base text-white">
                          취향 분석하러 가기
                        </Text>
                        <ChevronRight width={10} height={10} color="#FFFFFF" />
                      </LinearGradient>
                    </Pressable>
                  </View>
                </BlurView>
              )}
            </View>

            {/* 이번달 핫한 축제 */}
            <View className="py-2.5">
              <Text className="mb-[18px] px-[18px] text-xl font-semibold text-[#424242]">
                이번달 핫한 축제 🔥
              </Text>

              {isLoadingHotFestival ? (
                <View className="h-[154px] w-full items-center justify-center">
                  <ActivityIndicator size="large" color="#6C4DFF" />
                </View>
              ) : (
                <FlatList
                  data={hotFestivalData}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingHorizontal: 18,
                  }}
                  renderItem={({ item }) => <HotCard item={item} />}
                  keyExtractor={(item) => item.contentId.toString()}
                  ItemSeparatorComponent={() => <View className="w-3.5" />}
                />
              )}
            </View>

            {/* 금주 콘텐츠 */}
            <View className="flex gap-y-[18px] py-2.5">
              <Text className="px-[18px] text-xl font-semibold text-black">
                금주 콘텐츠를 한눈에 👀
              </Text>

              <FlatList
                data={weekDays}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: 18,
                }}
                renderItem={({ item }) => (
                  <Pressable
                    className={`flex h-[61px] w-[45px] items-center justify-center rounded-2xl ${
                      selectedWeekDayIndex === item.dayOfIndex
                        ? "border-0 bg-[#6C4DFF]"
                        : "border border-[#ECECEC] bg-white"
                    }`}
                    onPress={() => handleDateButtonPress(item.dayOfIndex)}
                  >
                    <Text
                      className={`text-lg font-medium ${
                        selectedWeekDayIndex === item.dayOfIndex
                          ? "text-white"
                          : "text-[#9E9E9E]"
                      }`}
                    >
                      {item.date}
                    </Text>
                    <Text
                      className={`text-sm font-normal ${selectedWeekDayIndex === item.dayOfIndex ? "text-white" : "text-[#9E9E9E]"}`}
                    >
                      {item.dayName}
                    </Text>
                  </Pressable>
                )}
                keyExtractor={(item) => item.dayOfIndex.toString()}
                ItemSeparatorComponent={() => <View className="w-2" />}
              />

              {isLoadingWeekDay ? (
                <View className="h-[270px] w-full items-center justify-center">
                  <ActivityIndicator size="large" color="#6C4DFF" />
                </View>
              ) : (
                <FlatList
                  data={chunkedFilteredContentData}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingHorizontal: 18,
                  }}
                  renderItem={({ item }) => (
                    <View className="w-[285px] flex-1 gap-y-[15.5px]">
                      {item.map((cardItem) => (
                        <WeeklyCard
                          key={cardItem.contentId.toString()}
                          item={cardItem}
                        />
                      ))}
                    </View>
                  )}
                  keyExtractor={(_, index) => index.toString()}
                  ItemSeparatorComponent={() => <View className="w-3.5" />}
                />
              )}

              <View className="px-[18px]">
                <Pressable
                  className="mt-1 h-[46px] w-full items-center justify-center rounded-md border border-[#6C4DFF] bg-white"
                  onPress={handleSchedulePress}
                >
                  <View className="flex-row items-center gap-x-1.5">
                    <Text className="text-[15px] font-normal text-[#6C4DFF]">
                      더보기
                    </Text>
                    <ChevronRight />
                  </View>
                </Pressable>
              </View>
            </View>

            {/* 이런 축제 어때요? */}
            <View className="py-2.5 pb-6">
              <View className="mb-[18px] flex-row items-center justify-between px-[18px]">
                <Text className="text-xl font-semibold text-[#424242]">
                  이런 축제 어때요?
                </Text>
                <Pressable
                  className="flex-row items-center gap-x-1.5"
                  onPress={handleSearchPress}
                >
                  <Text className="text-[13px] font-normal text-[#9E9E9E]">
                    더보기
                  </Text>
                  <ChevronRight width={10} height={10} color="#9E9E9E" />
                </Pressable>
              </View>

              {isLoadingCategoryContent ? (
                <View className="h-[154px] w-full items-center justify-center">
                  <ActivityIndicator size="large" color="#6C4DFF" />
                </View>
              ) : (
                <FlatList
                  data={categoryContentData}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingHorizontal: 18,
                  }}
                  renderItem={({ item }) => <MoreCard item={item} />}
                  keyExtractor={(item) => item.contentId.toString()}
                  ItemSeparatorComponent={() => <View className="w-3.5" />}
                />
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
