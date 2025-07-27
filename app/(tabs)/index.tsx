import { useState } from "react";

import dayjs from "dayjs";
import "dayjs/locale/ko";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { CelebrationIcon } from "@/components/icons/CelebrationIcon";
import ChevronRight from "@/components/icons/ChevronRight";
import { FoodIcon } from "@/components/icons/FoodIcon";
import LockIcon from "@/components/icons/LockIcon";
import { LogoIcon } from "@/components/icons/LogoIcon";
import { PaintIcon } from "@/components/icons/PaintIcon";
import { PaletteIcon } from "@/components/icons/PaletteIcon";
import SearchIcon from "@/components/icons/SearchIcon";

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

type CategoryType = (typeof categoryConfig)[number]["id"];

const categoryConfig = [
  { id: "PERFORMANCE", iconType: "paint", label: "공연" },
  { id: "EXHIBITION", iconType: "palette", label: "전시" },
  { id: "FESTIVAL", iconType: "celebration", label: "축제" },
  { id: "EVENT", iconType: "food", label: "행사" },
] as const;

const customContentData: CustomContentItem[] = [
  {
    contentId: 0,
    title: "벚꽃 축제",
    image:
      "https://mfnmcpsoimdf9o2j.public.blob.vercel-storage.com/detail-dummy.png",
    contentType: "PERFORMANCE",
    address: "서울 여의도",
    longitude: 126.925,
    latitude: 37.5301,
    startDate: "2025-07-20",
    endDate: "2025-07-30",
  },
  {
    contentId: 1,
    title: "음식 페스티벌",
    image:
      "https://mfnmcpsoimdf9o2j.public.blob.vercel-storage.com/detail-dummy.png",
    contentType: "FESTIVAL",
    address: "부산 해운대",
    longitude: 129.0756,
    latitude: 35.1595,
    startDate: "2025-07-22",
    endDate: "2025-07-23",
  },
  {
    contentId: 2,
    title: "재즈 콘서트",
    image:
      "https://mfnmcpsoimdf9o2j.public.blob.vercel-storage.com/detail-dummy.png",
    contentType: "PERFORMANCE",
    address: "대구 수성구",
    longitude: 128.6014,
    latitude: 35.8714,
    startDate: "2025-07-25",
    endDate: "2025-07-26",
  },
  {
    contentId: 3,
    title: "아트 마켓",
    image:
      "https://mfnmcpsoimdf9o2j.public.blob.vercel-storage.com/detail-dummy.png",
    contentType: "EXHIBITION",
    address: "광주 동구",
    longitude: 126.8526,
    latitude: 35.1595,
    startDate: "2025-07-27",
    endDate: "2025-07-28",
  },
  {
    contentId: 4,
    title: "문화 축제",
    image:
      "https://mfnmcpsoimdf9o2j.public.blob.vercel-storage.com/detail-dummy.png",
    contentType: "FESTIVAL",
    address: "인천 중구",
    longitude: 126.7052,
    latitude: 37.4563,
    startDate: "2025-07-23",
    endDate: "2025-07-24",
  },
  {
    contentId: 5,
    title: "야간 마켓",
    image:
      "https://mfnmcpsoimdf9o2j.public.blob.vercel-storage.com/detail-dummy.png",
    contentType: "EVENT",
    address: "대전 유성구",
    longitude: 127.3845,
    latitude: 36.3504,
    startDate: "2025-07-23",
    endDate: "2025-07-24",
  },
];

const Card = ({ item }: { item: CustomContentItem }) => {
  const router = useRouter();

  const handlePress = () => router.push(`/detail/${item.contentId}`);

  const formatDate = (date: string) => dayjs(date).format("YY.MM.DD");

  return (
    <Pressable className="flex-row" onPress={handlePress}>
      <Image
        source={{ uri: item.image }}
        className="h-[111px] w-[111px] rounded-[10px]"
        resizeMode="cover"
      />
      <View className="ml-3.5 flex-1">
        <Text className="mb-1 text-base font-semibold text-[#424242]">
          {item.title}
        </Text>
        <Text className="text-sm text-[#9E9E9E]">{item.address}</Text>
        <Text className="text-sm text-[#707070]">
          {formatDate(item.startDate)} ~ {formatDate(item.endDate)}
        </Text>
      </View>
    </Pressable>
  );
};

const HotCard = ({ item }: { item: CustomContentItem }) => {
  const router = useRouter();

  const handlePress = () => router.push(`/detail/${item.contentId}`);

  return (
    <Pressable className="w-[154px]" onPress={handlePress}>
      <Image
        source={{ uri: item.image }}
        className="h-[154px] w-[154px] rounded-[14px]"
        resizeMode="cover"
      />
      <View className="mt-2">
        <View className="mb-2 flex h-7 justify-center self-start rounded-full border border-[#6C4DFF] bg-white px-3">
          <Text className="text-sm font-medium text-[#6C4DFF]">축제</Text>
        </View>
        <Text className="mb-1.5 text-base font-semibold text-[#424242]">
          {item.title}
        </Text>
        <Text className="text-xs text-[#9E9E9E]" numberOfLines={1}>
          {item.address}
        </Text>
      </View>
    </Pressable>
  );
};

const WeeklyCard = ({ item }: { item: CustomContentItem }) => {
  const router = useRouter();

  const handlePress = () => router.push(`/detail/${item.contentId}`);

  const formatDate = (date: string) => dayjs(date).format("YY.MM.DD");

  return (
    <Pressable className="flex-row" onPress={handlePress}>
      <Image
        source={{ uri: item.image }}
        className="h-[90px] w-[120px] rounded-lg"
        resizeMode="cover"
      />
      <View className="ml-3.5 flex-1">
        <Text className="mb-1 text-base font-semibold text-[#424242]">
          {item.title}
        </Text>
        <Text className="text-sm font-normal text-[#9E9E9E]">
          {item.address}
        </Text>
        <Text className="text-sm font-normal text-[#707070]">
          {formatDate(item.startDate)} ~ {formatDate(item.endDate)}
        </Text>
      </View>
    </Pressable>
  );
};

const MoreCard = ({ item }: { item: CustomContentItem }) => {
  const router = useRouter();

  const handlePress = () => router.push(`/detail/${item.contentId}`);

  const formatDate = (date: string) => dayjs(date).format("YY.MM.DD");

  return (
    <Pressable className="w-[154px]" onPress={handlePress}>
      <Image
        source={{ uri: item.image }}
        className="h-[92px] w-full rounded-[14px]"
        resizeMode="cover"
      />
      <View className="mt-2">
        <Text className="text-base font-semibold text-[#424242]">
          {item.title}
        </Text>
        <Text className="mb-2 text-sm font-normal text-[#BDBDBD]">
          {formatDate(item.startDate)} ~ {formatDate(item.endDate)}
        </Text>
        <View className="mb-2 flex h-7 justify-center self-start rounded-full border border-[#6C4DFF] bg-white px-3">
          <Text className="text-sm font-medium text-[#6C4DFF]">축제</Text>
        </View>
      </View>
    </Pressable>
  );
};

const SCROLL_THRESHOLD = 30;

const chunkArray = (array: any[], chunkSize: number): any[][] => {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

const getWeekDays = () => {
  const today = dayjs();
  const startOfWeek = today.startOf("week").add(1, "day"); // 월요일부터 시작

  // 이번 주의 모든 날짜 생성 (월요일부터 일요일까지)
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = startOfWeek.add(i, "day");
    return {
      dayOfIndex: i,
      date: day.format("D"),
      dayName: day.format("ddd"),
      fullDate: day.format("YYYY-MM-DD"),
      isToday: day.isSame(today, "day"),
    };
  });

  // 오늘 날짜 찾기
  const todayIndex = weekDays.findIndex((day) => day.isToday);

  if (todayIndex === -1) {
    // 오늘이 이번 주에 없으면 기본 순서 반환
    return weekDays.map((day, index) => ({ ...day, dayOfIndex: index }));
  }

  // 오늘을 첫 번째로, 나머지를 순서대로 배치
  const reorderedDays = [
    weekDays[todayIndex],
    ...weekDays.slice(0, todayIndex), // 오늘 이전 날짜들
    ...weekDays.slice(todayIndex + 1), // 오늘 이후 날짜들
  ];

  // dayOfIndex를 새로운 순서에 맞게 재설정
  return reorderedDays.map((day, index) => ({
    ...day,
    dayOfIndex: index,
  }));
};

export default function HomeScreen() {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [selectedCustomContentCategory, setSelectedCustomContentCategory] =
    useState<CategoryType>("PERFORMANCE");
  const [selectedWeeklyDateIndex, setSelectedWeeklyDateIndex] =
    useState<number>(0); // 오늘이 첫 번째(인덱스 0)에 위치
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // 임시 로그인 여부 상태

  const router = useRouter();

  const weekDays = getWeekDays();

  // 선택된 카테고리에 해당하는 데이터 필터링
  const getFilteredContentByCategory = () => {
    return customContentData.filter(
      (item) => item.contentType === selectedCustomContentCategory,
    );
  };

  // 선택된 날짜에 해당하는 데이터 필터링
  const getFilteredContentBySelectedDay = () => {
    const selectedDayData = weekDays.find(
      (day) => day.dayOfIndex === selectedWeeklyDateIndex,
    );
    if (!selectedDayData) return [];

    const selectedDate = dayjs(selectedDayData.fullDate);

    // 선택한 날짜가 이벤트의 startDate와 endDate 사이에 있는지 확인
    return customContentData.filter((item) => {
      const startDate = dayjs(item.startDate);
      const endDate = dayjs(item.endDate);

      return (
        selectedDate.isSameOrAfter(startDate, "day") &&
        selectedDate.isSameOrBefore(endDate, "day")
      );
    });
  };

  const filteredCustomContentByCategory = getFilteredContentByCategory();
  const filteredCustomContentData = getFilteredContentBySelectedDay();
  const chunkedFilteredCategoryData = chunkArray(
    filteredCustomContentByCategory,
    3,
  );
  const chunkedFilteredContentData = chunkArray(filteredCustomContentData, 3);

  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setIsScrolled(scrollY > SCROLL_THRESHOLD);
  };

  const handleSearchPress = () => {
    router.push("/(tabs)/search");
  };

  const handleSchedulePress = () => {
    router.push("/(tabs)/schedule");
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style={isScrolled ? "dark" : "light"} />

      {/* 스크롤 시 보이는 헤더 */}
      {isScrolled && (
        <View
          className="absolute left-0 right-0 top-0 z-10 flex h-40 justify-end bg-white p-[18px]"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.14,
            shadowRadius: 14,
            elevation: 5,
          }}
        >
          <Pressable
            className="h-11 flex-row items-center gap-x-3 rounded-full border border-[#6B51FB] bg-white px-[18px] py-3"
            onPress={handleSearchPress}
          >
            <SearchIcon size={24} color="#6B51FB" />
            <Text className="text-[#6E6E6E]">
              6월에 안가면 손해! 고창 수박 축제
            </Text>
          </Pressable>
        </View>
      )}

      <ScrollView
        className="flex-1"
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* 기본 헤더 */}
        <LinearGradient
          colors={["#816BFF", "#816BFF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.2, y: 1 }}
          locations={[0.0683, 0.9503]}
        >
          <View className="h-48 flex-row items-end justify-center px-[18px] pb-11">
            <View className="w-full flex-row items-center gap-x-2">
              <LogoIcon width={35} height={32} />
              <Pressable
                className="h-11 flex-1 flex-row items-center justify-between rounded-full bg-white px-[18px] py-3"
                onPress={handleSearchPress}
              >
                <Text className="text-[#6E6E6E]">
                  6월에 안가면 손해! 고창 수박 축제
                </Text>
                <SearchIcon size={24} color="#6B51FB" />
              </Pressable>
            </View>
          </View>
        </LinearGradient>

        <View className="mb-10 mt-[-20px] flex-1 rounded-t-3xl bg-white">
          {/* 카테고리 버튼 */}
          <View className="px-6 pb-[11px] pt-6">
            <View className="flex-row items-center justify-center gap-x-6">
              {categoryConfig.map((item) => (
                <View className="gap-y-[7px]" key={item.id}>
                  <View className="flex h-16 w-16 items-center justify-center rounded-[14px] bg-[#F5F5F5]">
                    {item.iconType === "paint" && (
                      <PaintIcon width={32} height={32} />
                    )}
                    {item.iconType === "palette" && (
                      <PaletteIcon width={32} height={29} />
                    )}
                    {item.iconType === "celebration" && (
                      <CelebrationIcon width={48} height={48} />
                    )}
                    {item.iconType === "food" && (
                      <FoodIcon width={30} height={30} />
                    )}
                  </View>
                  <Text className="text-center text-sm text-black">
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View className="gap-y-[34px]">
            {/* 맞춤 콘텐츠 */}
            <View className="px-[18px] py-2.5">
              <Text className="text-xl font-semibold text-black">
                OO님을 위한 맞춤 콘텐츠
              </Text>

              <View className="mb-5 mt-3 flex-row gap-x-2.5">
                {categoryConfig.map((category) => {
                  const isSelected =
                    selectedCustomContentCategory === category.id;
                  const isDisabled = !isLoggedIn;

                  return (
                    <Pressable
                      key={category.id}
                      disabled={isDisabled}
                      className={`flex h-8 w-12 items-center justify-center rounded-full border border-[#6C4DFF] ${
                        isSelected ? "bg-[#6C4DFF]" : "bg-white"
                      }`}
                      onPress={() => {
                        if (!isDisabled)
                          setSelectedCustomContentCategory(category.id);
                      }}
                    >
                      <Text
                        className={`text-sm ${
                          isSelected ? "text-white" : "text-[#6C4DFF]"
                        }`}
                      >
                        {category.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <View className="relative">
                <FlatList
                  data={chunkedFilteredCategoryData}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <View className="w-[310px] flex-1 gap-y-[15.5px]">
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

                {/* 로그인하지 않은 경우 오버레이 */}
                {!isLoggedIn && (
                  <BlurView
                    intensity={8}
                    className="absolute inset-0 m-[-10px] flex items-center justify-center"
                  >
                    <View className="absolute inset-0 bg-white/80" />
                    <View className="items-center gap-y-2.5">
                      <LockIcon />
                      <View>
                        <Text className="text-center text-lg font-medium text-[#212121]">
                          회원가입하고
                        </Text>
                        <Text className="text-center text-lg font-medium text-[#212121]">
                          맞춤 컨텐츠를 확인해보세요!
                        </Text>
                      </View>
                      <Pressable onPress={() => setIsLoggedIn(true)}>
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
                            gap: 4,
                          }}
                        >
                          <Text className="font-base text-sm text-white">
                            회원가입하기
                          </Text>
                          <ChevronRight
                            width={10}
                            height={10}
                            color="#FFFFFF"
                          />
                        </LinearGradient>
                      </Pressable>
                    </View>
                  </BlurView>
                )}
              </View>
            </View>

            {/* 이번달 핫한 축제 */}
            <View className="px-[18px] py-2.5">
              <Text className="mb-[18px] text-xl font-semibold text-[#424242]">
                이번달 핫한 축제 🔥
              </Text>

              <FlatList
                data={customContentData}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => <HotCard item={item} />}
                keyExtractor={(item) => item.contentId.toString()}
                ItemSeparatorComponent={() => <View className="w-3.5" />}
              />
            </View>

            {/* 금주 콘텐츠 */}
            <View className="flex gap-y-[18px] px-[18px] py-2.5">
              <Text className="text-xl font-semibold text-black">
                금주 콘텐츠를 한눈에👀
              </Text>

              <FlatList
                data={weekDays}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <Pressable
                    className={`flex h-[61px] w-[45px] items-center justify-center rounded-2xl ${
                      selectedWeeklyDateIndex === item.dayOfIndex
                        ? "border-0 bg-[#6C4DFF]"
                        : "border border-[#ECECEC] bg-white"
                    }`}
                    onPress={() => setSelectedWeeklyDateIndex(item.dayOfIndex)}
                  >
                    <Text
                      className={`text-lg font-medium ${
                        selectedWeeklyDateIndex === item.dayOfIndex
                          ? "text-white"
                          : "text-[#9E9E9E]"
                      }`}
                    >
                      {item.date}
                    </Text>
                    <Text
                      className={`text-sm font-normal ${selectedWeeklyDateIndex === item.dayOfIndex ? "text-white" : "text-[#9E9E9E]"}`}
                    >
                      {item.dayName}
                    </Text>
                  </Pressable>
                )}
                keyExtractor={(item) => item.dayOfIndex.toString()}
                ItemSeparatorComponent={() => <View className="w-2" />}
              />

              <FlatList
                data={chunkedFilteredContentData}
                horizontal
                showsHorizontalScrollIndicator={false}
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

            {/* 이런 축제 어때요? */}
            <View className="px-[18px] py-2.5">
              <View className="mb-[18px] flex-row items-center justify-between">
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

              <FlatList
                data={customContentData}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => <MoreCard item={item} />}
                keyExtractor={(item) => item.contentId.toString()}
                ItemSeparatorComponent={() => <View className="w-3.5" />}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
