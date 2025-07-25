import { useState } from "react";

import dayjs from "dayjs";
import "dayjs/locale/ko";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { CelebrationIcon } from "@/components/icons/CelebrationIcon";
import { FoodIcon } from "@/components/icons/FoodIcon";
import { LogoIcon } from "@/components/icons/LogoIcon";
import { PaintIcon } from "@/components/icons/PaintIcon";
import { PaletteIcon } from "@/components/icons/PaletteIcon";
import { SearchIcon } from "@/components/icons/SearchIcon";

// dayjs 한국어 로케일 설정
dayjs.locale("ko");

interface DummyItem {
  id: string;
  title: string;
  subtitle: string;
}

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

const customContentData: CustomContentItem[] = [
  {
    contentId: 0,
    title: "벚꽃 축제",
    image:
      "https://mfnmcpsoimdf9o2j.public.blob.vercel-storage.com/detail-dummy.png",
    contentType: "EXHIBITION",
    address: "서울 여의도",
    longitude: 126.925,
    latitude: 37.5301,
    startDate: "2025-07-05",
    endDate: "2025-07-06",
  },
  {
    contentId: 1,
    title: "음식 페스티벌",
    image:
      "https://mfnmcpsoimdf9o2j.public.blob.vercel-storage.com/detail-dummy.png",
    contentType: "EXHIBITION",
    address: "부산 해운대",
    longitude: 129.0756,
    latitude: 35.1595,
    startDate: "2025-07-07",
    endDate: "2025-07-08",
  },
  {
    contentId: 2,
    title: "재즈 콘서트",
    image:
      "https://mfnmcpsoimdf9o2j.public.blob.vercel-storage.com/detail-dummy.png",
    contentType: "EXHIBITION",
    address: "대구 수성구",
    longitude: 128.6014,
    latitude: 35.8714,
    startDate: "2025-07-09",
    endDate: "2025-07-09",
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
    startDate: "2025-07-10",
    endDate: "2025-07-11",
  },
  {
    contentId: 4,
    title: "문화 축제",
    image:
      "https://mfnmcpsoimdf9o2j.public.blob.vercel-storage.com/detail-dummy.png",
    contentType: "EXHIBITION",
    address: "인천 중구",
    longitude: 126.7052,
    latitude: 37.4563,
    startDate: "2025-07-12",
    endDate: "2025-07-13",
  },
  {
    contentId: 5,
    title: "야간 마켓",
    image:
      "https://mfnmcpsoimdf9o2j.public.blob.vercel-storage.com/detail-dummy.png",
    contentType: "EXHIBITION",
    address: "대전 유성구",
    longitude: 127.3845,
    latitude: 36.3504,
    startDate: "2025-07-14",
    endDate: "2025-07-15",
  },
];

const festivalData: DummyItem[] = [
  { id: "1", title: "서울 불꽃축제", subtitle: "한강 여의도" },
  { id: "2", title: "부산 바다축제", subtitle: "해운대 해변" },
  { id: "3", title: "제주 유채꽃축제", subtitle: "제주 서귀포" },
  { id: "4", title: "경주 벚꽃축제", subtitle: "경주 보문단지" },
  { id: "5", title: "강릉 커피축제", subtitle: "강릉 안목해변" },
  { id: "6", title: "전주 한옥축제", subtitle: "전주 한옥마을" },
];

const weeklyContentData: { [key: string]: DummyItem[] } = {
  "0": [
    { id: "sun1", title: "일요일 브런치 마켓", subtitle: "서울 성수동" },
    { id: "sun2", title: "가족 나들이 축제", subtitle: "경기 용인" },
  ],
  "1": [
    { id: "mon1", title: "월요일 재즈 클럽", subtitle: "서울 홍대" },
    { id: "mon2", title: "도심 속 힐링", subtitle: "서울 한강공원" },
  ],
  "2": [
    { id: "tue1", title: "화요일 아트마켓", subtitle: "서울 이태원" },
    { id: "tue2", title: "전통 공예 체험", subtitle: "인사동" },
  ],
  "3": [
    { id: "wed1", title: "수요일 야시장", subtitle: "부산 광안리" },
    { id: "wed2", title: "중간 쉼표 콘서트", subtitle: "대구 중구" },
  ],
  "4": [
    { id: "thu1", title: "목요일 맥주축제", subtitle: "강남 가로수길" },
    { id: "thu2", title: "직장인 문화모임", subtitle: "서울 명동" },
  ],
  "5": [
    { id: "fri1", title: "불금 파티", subtitle: "서울 클럽 거리" },
    { id: "fri2", title: "금요 야경투어", subtitle: "서울 남산타워" },
  ],
  "6": [
    { id: "sat1", title: "토요일 벼룩시장", subtitle: "서울 홍대" },
    { id: "sat2", title: "주말 캠핑축제", subtitle: "강원 춘천" },
  ],
};

const Card = ({ item }: { item: CustomContentItem }) => {
  const router = useRouter();

  const handlePress = () => router.push(`/(tabs)/detail/${item.contentId}`);

  return (
    <Pressable
      className="flex-row border border-blue-500"
      onPress={handlePress}
    >
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
          {item.startDate} ~ {item.endDate}
        </Text>
      </View>
    </Pressable>
  );
};

const HotCard = ({ item }: { item: CustomContentItem }) => {
  const router = useRouter();

  const handlePress = () => router.push(`/(tabs)/detail/${item.contentId}`);

  return (
    <Pressable
      className="w-[154px] border border-blue-500"
      onPress={handlePress}
    >
      <Image
        source={{ uri: item.image }}
        className="h-[154px] w-[154px] rounded-[10px]"
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

const chunkArray = (array: any[], chunkSize: number): any[][] => {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

const SCROLL_THRESHOLD = 30;

const getWeekDays = () => {
  const today = dayjs();
  const startOfWeek = today.startOf("week");

  return Array.from({ length: 7 }, (_, i) => {
    const day = startOfWeek.add(i, "day");
    return {
      date: day.format("D"),
      dayName: day.format("ddd"),
      dayOfWeek: i,
      fullDate: day.format("YYYY-MM-DD"),
      isToday: day.isSame(today, "day"),
    };
  });
};

const DayButton = ({
  day,
  isSelected,
  onPress,
}: {
  day: { date: string; dayName: string; dayOfWeek: number; isToday: boolean };
  isSelected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={`mx-1 flex h-16 w-12 items-center justify-center rounded-2xl ${
      isSelected ? "border-0" : "border border-gray-300 bg-white"
    }`}
    style={{
      backgroundColor: isSelected ? "#816BFF" : "white",
    }}
  >
    <Text
      className={`text-lg font-semibold ${
        isSelected ? "text-white" : "text-gray-400"
      }`}
    >
      {day.date}
    </Text>
    <Text className={`text-xs ${isSelected ? "text-white" : "text-gray-400"}`}>
      {day.dayName}
    </Text>
  </TouchableOpacity>
);

const categoryConfig = [
  { id: "PERFORMANCE", iconType: "paint", label: "공연" },
  { id: "EXHIBITION", iconType: "palette", label: "전시" },
  { id: "FESTIVAL", iconType: "celebration", label: "축제" },
  { id: "EVENT", iconType: "food", label: "행사" },
] as const;

type CategoryType = (typeof categoryConfig)[number]["id"];

export default function HomeScreen() {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState<number>(dayjs().day());
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryType>("PERFORMANCE");

  const router = useRouter();

  const weekDays = getWeekDays();
  const selectedDayContent = weeklyContentData[selectedDay.toString()] || [];
  const chunkedCustomContentData = chunkArray(customContentData, 3);

  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setIsScrolled(scrollY > SCROLL_THRESHOLD);
  };

  const handleSearchPress = () => {
    router.push("/(tabs)/search");
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style={isScrolled ? "dark" : "light"} />

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
            <SearchIcon width={18} height={19} />
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
                <SearchIcon width={18} height={19} />
              </Pressable>
            </View>
          </View>
        </LinearGradient>

        <View className="mt-[-20px] flex-1 rounded-t-3xl border border-red-500 bg-white">
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
            <View className="border border-blue-500 px-[18px] py-2.5">
              <Text className="text-xl font-semibold text-black">
                OO님을 위한 맞춤 콘텐츠
              </Text>

              <View className="mb-5 mt-3">
                <View className="flex-row gap-x-2.5">
                  {categoryConfig.map((category) => {
                    const isSelected = selectedCategory === category.id;
                    return (
                      <Pressable
                        key={category.id}
                        className={`flex h-8 w-12 items-center justify-center rounded-full border border-[#6C4DFF] ${
                          isSelected ? "bg-[#6C4DFF]" : "bg-white"
                        }`}
                        onPress={() => {
                          setSelectedCategory(category.id);
                          console.log(`${category.label} 카테고리 선택됨`);
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
              </View>

              <FlatList
                data={chunkedCustomContentData}
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
            </View>

            <View className="border border-green-500 px-[18px] py-2.5">
              <Text className="mb-[18px] text-xl font-semibold text-[#424242]">
                MD픽 추천 컨텐츠🔥
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

            <View className="border border-yellow-500">
              <View className="mb-3 flex-row items-center justify-between">
                <Text className="text-lg font-bold text-black">
                  금주 컨텐츠를 한눈에
                </Text>
                <TouchableOpacity>
                  <Text className="text-sm text-gray-500">더보기</Text>
                </TouchableOpacity>
              </View>

              <View className="mb-4">
                <FlatList
                  data={weekDays}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 4 }}
                  renderItem={({ item }) => (
                    <DayButton
                      day={item}
                      isSelected={selectedDay === item.dayOfWeek}
                      onPress={() => setSelectedDay(item.dayOfWeek)}
                    />
                  )}
                  keyExtractor={(item) => item.dayOfWeek.toString()}
                />
              </View>

              {/* <FlatList
                data={selectedDayContent}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => <Card item={item} />}
                keyExtractor={(item) => item.id}
              /> */}
            </View>

            <View className="border border-purple-500">
              <View className="mb-3 flex-row items-center justify-between">
                <Text className="text-lg font-bold text-black">
                  이런 축제 어때요?
                </Text>
                <TouchableOpacity>
                  <Text className="text-sm text-gray-500">더보기</Text>
                </TouchableOpacity>
              </View>

              {/* <FlatList
                data={festivalData}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => <Card item={item} />}
                keyExtractor={(item) => item.id}
              /> */}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
