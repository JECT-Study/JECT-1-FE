import React, { useCallback, useEffect, useState } from "react";

import dayjs from "dayjs";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { CalendarProvider } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";

import ScheduleEmptyState from "@/components/schedule/ScheduleEmptyState";
import ScheduleItem from "@/components/schedule/ScheduleItem";
import CommonCalendar from "@/components/ui/CommonCalendar";
import Divider from "@/components/ui/Divider";
import { BACKEND_URL } from "@/constants/ApiUrls";
import { ScheduleItemType } from "@/constants/ScheduleData";
import { publicApi } from "@/features/axios/axiosInstance";
import { ScheduleApiResponse } from "@/interfaces/search.interfaces";
import { ensureMinLoadingTime } from "@/utils/loadingUtils";

// 페이지네이션 상수
const SCHEDULE_LIMIT = 8;

const formatSelectedDateHeader = (date: string) => {
  const dayOfWeek = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ];

  const selectedDay = dayjs(date);
  const today = dayjs();
  const isToday = selectedDay.isSame(today, "day");

  const dayName = dayOfWeek[selectedDay.day()];
  const dateText = `${selectedDay.date()}일 ${dayName}`;
  return isToday ? `${dateText} (오늘)` : dateText;
};

export default function ScheduleScreen() {
  const [schedules, setSchedules] = useState<ScheduleItemType[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    dayjs().format("YYYY-MM-DD"),
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true); // 초기 로딩 상태
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMoreData, setHasMoreData] = useState<boolean>(true);

  // 스케줄 데이터 API 호출 함수
  const fetchScheduleData = useCallback(
    async (
      date: string,
      page: number = 1,
      isLoadMore: boolean = false,
      isInitial: boolean = false,
    ) => {
      const startTime = dayjs().valueOf();

      try {
        if (isLoadMore) {
          setIsLoadingMore(true);
        } else {
          setIsLoading(true);
          if (page === 1) {
            setSchedules([]); // 새로운 날짜 검색시 기존 데이터 초기화
          }
        }

        const response = await publicApi.get<ScheduleApiResponse>(
          `${BACKEND_URL}/schedules`,
          {
            params: {
              page: page,
              limit: SCHEDULE_LIMIT,
              day: date,
            },
          },
        );

        if (response.data.isSuccess && response.data.result) {
          const { content, totalPages, number } = response.data.result;

          if (isLoadMore) {
            setSchedules((prev) => [...prev, ...content]);
          } else {
            setSchedules(content);
          }

          setCurrentPage(number);
          setHasMoreData(number < totalPages);

          console.log(
            `스케줄 데이터 로딩 완료: ${date}, 페이지 ${number}/${totalPages}`,
          );
        } else {
          if (!isLoadMore) {
            setSchedules([]);
          }
          setHasMoreData(false);
          console.log("스케줄 데이터 없음 또는 API 오류");
        }
      } catch (error) {
        console.error("스케줄 데이터 로딩 실패:", error);
        if (!isLoadMore) {
          setSchedules([]);
        }
        setHasMoreData(false);
      } finally {
        await ensureMinLoadingTime(startTime);

        if (isLoadMore) {
          setIsLoadingMore(false);
        } else {
          setIsLoading(false);
        }
        if (isInitial) {
          setIsInitialLoading(false); // 초기 로딩 완료
        }
      }
    },
    [],
  );

  // 초기 데이터 로딩
  useEffect(() => {
    fetchScheduleData(selectedDate, 1, false, true); // 초기 로딩 플래그 true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 무한스크롤 핸들러
  const handleLoadMore = useCallback(() => {
    if (hasMoreData && !isLoadingMore) {
      const nextPage = currentPage + 1;
      console.log(`다음 페이지 로딩: ${nextPage}`);
      fetchScheduleData(selectedDate, nextPage, true, false); // 무한스크롤은 초기 로딩 아님
    }
  }, [
    hasMoreData,
    isLoadingMore,
    currentPage,
    selectedDate,
    fetchScheduleData,
  ]);

  // 날짜 변경 핸들러
  const handleDateChange = useCallback(
    (date: string) => {
      setSelectedDate(date);
      setCurrentPage(1);
      setHasMoreData(true);
      fetchScheduleData(date, 1, false, false); // 날짜 변경은 초기 로딩 아님
    },
    [fetchScheduleData],
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <StatusBar style="dark" />
      <View className="flex-1 bg-[#F9FAFC]">
        <View className="border-b border-[#DCDEE3] bg-white px-4 py-3">
          <Text className="text-center text-lg font-medium text-[#212121]">
            컨텐츠 일정
          </Text>
        </View>

        <CalendarProvider date={selectedDate}>
          {isInitialLoading ? (
            <View className="flex-1 items-center justify-center py-20">
              <ActivityIndicator size="large" color="#6C4DFF" />
              <Text className="mt-4 text-center text-gray-500">
                캘린더를 불러오는 중...
              </Text>
            </View>
          ) : (
            <CommonCalendar
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
            />
          )}

          <FlatList
            className="mx-4 mt-7 flex-1"
            data={schedules}
            renderItem={({ item }) => <ScheduleItem item={item} />}
            keyExtractor={(item) => item.contentId.toString()}
            ListEmptyComponent={
              isLoading ? (
                <View className="flex-1 items-center justify-center py-20">
                  <ActivityIndicator size="large" color="#6C4DFF" />
                  <Text className="mt-4 text-center text-gray-500">
                    스케줄을 불러오는 중...
                  </Text>
                </View>
              ) : (
                <ScheduleEmptyState />
              )
            }
            ListHeaderComponent={
              schedules.length > 0
                ? () => (
                    <View className="mb-4">
                      <Text className="text-[13px] font-normal text-[#9E9E9E]">
                        {formatSelectedDateHeader(selectedDate)}
                      </Text>
                    </View>
                  )
                : null
            }
            ListFooterComponent={
              isLoadingMore ? (
                <View className="flex-row items-center justify-center py-4">
                  <ActivityIndicator size="large" color="#6C4DFF" />
                </View>
              ) : !hasMoreData && schedules.length > 0 ? (
                <View className="items-center justify-center py-4">
                  <Text className="text-sm text-gray-500">
                    모든 스케줄을 불러왔습니다.
                  </Text>
                </View>
              ) : null
            }
            ItemSeparatorComponent={() => (
              <Divider bg="bg-[#EEE]" className="my-3" />
            )}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: schedules.length === 0 ? "center" : "flex-start",
            }}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            removeClippedSubviews={true}
            initialNumToRender={10}
            showsVerticalScrollIndicator={false}
          />
        </CalendarProvider>
      </View>
    </SafeAreaView>
  );
}
