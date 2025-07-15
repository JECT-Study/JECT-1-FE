import React, { useState } from "react";

import dayjs from "dayjs";
import "dayjs/locale/ko";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  FlatList,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

// dayjs 한국어 로케일 설정
dayjs.locale("ko");

interface DummyItem {
  id: string;
  title: string;
  subtitle: string;
}

const customContentData: DummyItem[] = [
  { id: "1", title: "벚꽃 축제 2024", subtitle: "서울 여의도" },
  { id: "2", title: "음식 페스티벌", subtitle: "부산 해운대" },
  { id: "3", title: "재즈 콘서트", subtitle: "대구 수성구" },
  { id: "4", title: "아트 마켓", subtitle: "광주 동구" },
  { id: "5", title: "문화 축제", subtitle: "인천 중구" },
  { id: "6", title: "야간 마켓", subtitle: "대전 유성구" },
];

const mdPickData: DummyItem[] = [
  { id: "1", title: "HOT 가을 축제", subtitle: "전국 인기 축제" },
  { id: "2", title: "맛집 투어", subtitle: "미식가 추천" },
  { id: "3", title: "야경 명소", subtitle: "로맨틱 스팟" },
  { id: "4", title: "체험 활동", subtitle: "가족 여행" },
  { id: "5", title: "힐링 여행", subtitle: "휴양지 추천" },
  { id: "6", title: "문화 체험", subtitle: "역사 탐방" },
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

const skeletonData = Array.from({ length: 8 }, (_, i) => ({
  id: i.toString(),
}));

const categoryData = Array.from({ length: 4 }, (_, i) => ({
  id: i.toString(),
}));

const Card = ({ item }: { item: DummyItem }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/detail/${item.id}`);
  };

  return (
    <TouchableOpacity className="mr-4" onPress={handlePress}>
      <View className="mb-2 h-32 w-40 rounded-lg bg-gray-400" />
      <ThemedText
        className="mb-1 w-36 font-medium text-black"
        numberOfLines={1}
      >
        {item.title}
      </ThemedText>
      <ThemedText className="w-32 text-sm text-gray-600" numberOfLines={1}>
        {item.subtitle}
      </ThemedText>
    </TouchableOpacity>
  );
};

const SCROLL_THRESHOLD = 50;

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
    <ThemedText
      className={`text-lg font-semibold ${
        isSelected ? "text-white" : "text-gray-400"
      }`}
    >
      {day.date}
    </ThemedText>
    <ThemedText
      className={`text-xs ${isSelected ? "text-white" : "text-gray-400"}`}
    >
      {day.dayName}
    </ThemedText>
  </TouchableOpacity>
);

export default function HomeScreen() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number>(dayjs().day());

  const weekDays = getWeekDays();
  const selectedDayContent = weeklyContentData[selectedDay.toString()] || [];

  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setIsScrolled(scrollY > SCROLL_THRESHOLD);
  };

  return (
    <View className="flex-1 bg-white">
      {isScrolled && (
        <View
          className="absolute left-0 right-0 top-0 z-10 bg-white px-4 pb-2 pt-24"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <TextInput
            className="h-11 rounded-full bg-gray-100 px-4 py-3"
            placeholder="6월에 안가면 손해! 고성 복분자 수확축제"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      )}

      <ScrollView
        className="flex-1"
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <LinearGradient
          colors={["#816BFF", "#705EDB"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0.1 }}
          locations={[0.0683, 0.9503]}
        >
          <View className="pb-6 pt-20">
            <View className="mb-1 items-center">
              <View className="rounded bg-white px-4 py-2">
                <ThemedText className="font-medium text-black">로고</ThemedText>
              </View>
            </View>

            <TextInput
              className="mx-4 my-3 h-11 rounded-full bg-white px-4 py-3"
              placeholder="검색창"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </LinearGradient>

        <ThemedView className="-mt-6 flex-1 rounded-t-3xl px-4 pb-10 pt-6">
          <View className="mb-6">
            <View className="flex-row items-center justify-center gap-6">
              {categoryData.map((item) => (
                <View
                  key={item.id}
                  className="mr-2 h-16 w-16 rounded-2xl bg-gray-300"
                />
              ))}
            </View>
          </View>

          <View className="flex-1 gap-y-8">
            <ThemedView>
              <View className="mb-3 flex-row items-center justify-between">
                <ThemedText type="subtitle" className="font-bold text-black">
                  맞춤 컨텐츠
                </ThemedText>
              </View>

              <View className="mb-3">
                <FlatList
                  data={skeletonData}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={() => (
                    <View className="mr-2 h-8 w-16 rounded-full bg-gray-300" />
                  )}
                  keyExtractor={(item) => item.id}
                />
              </View>

              <FlatList
                data={customContentData}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => <Card item={item} />}
                keyExtractor={(item) => item.id}
              />
            </ThemedView>

            <ThemedView>
              <View className="mb-3 flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <ThemedText type="subtitle" className="font-bold text-black">
                    MD픽 추천 컨텐츠
                  </ThemedText>
                  <ThemedText className="ml-1 text-orange-500">🔥</ThemedText>
                </View>
                <TouchableOpacity>
                  <ThemedText className="text-sm text-gray-500">
                    더보기
                  </ThemedText>
                </TouchableOpacity>
              </View>

              <FlatList
                data={mdPickData}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => <Card item={item} />}
                keyExtractor={(item) => item.id}
              />
            </ThemedView>

            <ThemedView>
              <View className="mb-3 flex-row items-center justify-between">
                <ThemedText type="subtitle" className="font-bold text-black">
                  금주 컨텐츠를 한눈에
                </ThemedText>
                <TouchableOpacity>
                  <ThemedText className="text-sm text-gray-500">
                    더보기
                  </ThemedText>
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

              <FlatList
                data={selectedDayContent}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => <Card item={item} />}
                keyExtractor={(item) => item.id}
              />
            </ThemedView>

            <ThemedView>
              <View className="mb-3 flex-row items-center justify-between">
                <ThemedText type="subtitle" className="font-bold text-black">
                  이런 축제 어때요?
                </ThemedText>
                <TouchableOpacity>
                  <ThemedText className="text-sm text-gray-500">
                    더보기
                  </ThemedText>
                </TouchableOpacity>
              </View>

              <FlatList
                data={festivalData}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => <Card item={item} />}
                keyExtractor={(item) => item.id}
              />
            </ThemedView>
          </View>
        </ThemedView>
      </ScrollView>
    </View>
  );
}
