import React, { useCallback, useEffect, useState } from "react";

import dayjs from "dayjs";
import { router } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { CalendarProvider } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";

import DeleteScheduleAlert from "@/components/schedule/DeleteScheduleAlert";
import DeleteScheduleBottomSheet from "@/components/schedule/DeleteScheduleBottomSheet";
import ScheduleEmptyState from "@/components/schedule/ScheduleEmptyState";
import ScheduleItem from "@/components/schedule/ScheduleItem";
import CommonCalendar from "@/components/ui/CommonCalendar";
import CustomHeader from "@/components/ui/CustomHeader";
import Divider from "@/components/ui/Divider";
import { BACKEND_URL } from "@/constants/ApiUrls";
import { ScheduleItemType } from "@/constants/ScheduleData";
import { authApi } from "@/features/axios/axiosInstance";
import { ScheduleApiResponse } from "@/interfaces/search.interfaces";

const SCHEDULE_LIMIT = 10;

// 최소 로딩 시간 보장 함수
const ensureMinLoadingTime = async (
  startTime: number,
  minTime: number = 500,
) => {
  const elapsedTime = dayjs().valueOf() - startTime;
  if (elapsedTime < minTime) {
    await new Promise((resolve) => setTimeout(resolve, minTime - elapsedTime));
  }
};

// 선택된 날짜 헤더 포맷팅 함수
const formatSelectedDateHeader = (dateString: string) => {
  const date = dayjs(dateString);
  const today = dayjs();

  if (date.isSame(today, "day")) {
    return `오늘 ${date.format("M월 D일")}`;
  } else if (date.isSame(today.add(1, "day"), "day")) {
    return `내일 ${date.format("M월 D일")}`;
  } else if (date.isSame(today.subtract(1, "day"), "day")) {
    return `어제 ${date.format("M월 D일")}`;
  } else {
    return date.format("M월 D일");
  }
};

export default function Plan() {
  const [schedules, setSchedules] = useState<ScheduleItemType[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    dayjs().format("YYYY-MM-DD"),
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [hasMoreData, setHasMoreData] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [showBottomSheet, setShowBottomSheet] = useState<boolean>(false);

  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
  const [selectedContentId, setSelectedContentId] = useState<number | null>(
    null,
  );

  // 스케줄 데이터 API 호출 함수
  const fetchScheduleData = useCallback(
    async (date: string, page: number = 0, isLoadMore: boolean = false) => {
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

        const response = await authApi.get<ScheduleApiResponse>(
          `${BACKEND_URL}/users/schedules`,
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
            `사용자 스케줄 데이터 로딩 완료: ${date}, 페이지 ${number}/${totalPages}`,
          );
        } else {
          if (!isLoadMore) {
            setSchedules([]);
          }
          setHasMoreData(false);
          console.log("사용자 스케줄 데이터 없음 또는 API 오류");
        }
      } catch (error) {
        console.error("사용자 스케줄 데이터 로딩 실패:", error);
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
      }
    },
    [],
  );

  // 초기 데이터 로딩
  useEffect(() => {
    fetchScheduleData(selectedDate, 0, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 무한스크롤 핸들러
  const handleLoadMore = useCallback(() => {
    if (hasMoreData && !isLoadingMore) {
      const nextPage = currentPage + 1;
      console.log(`다음 페이지 로딩: ${nextPage}`);
      fetchScheduleData(selectedDate, nextPage, true);
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
      fetchScheduleData(date, 0, false);
    },
    [fetchScheduleData],
  );

  // 스케줄 아이템 클릭 핸들러
  const handleScheduleItemPress = useCallback((contentId: number) => {
    router.push(`/detail/${contentId}`);
  }, []);

  // 새로고침 핸들러
  const onRefresh = useCallback(() => {
    setRefresh(true);
    setCurrentPage(1);
    setHasMoreData(true);
    fetchScheduleData(selectedDate, 0, false).finally(() => {
      setRefresh(false);
    });
  }, [selectedDate, fetchScheduleData]);

  // 메뉴 버튼 클릭 핸들러
  const handleMenuPress = useCallback((contentId: number) => {
    console.log("메뉴 버튼 클릭됨. contentId:", contentId);
    setSelectedContentId(contentId);
    setShowBottomSheet(true);
  }, []);

  // 바텀시트 삭제 클릭 핸들러
  const handleBottomSheetDelete = useCallback(() => {
    console.log(
      "바텀시트 삭제 버튼 클릭. selectedContentId:",
      selectedContentId,
    );
    setShowBottomSheet(false);
    setShowDeleteAlert(true);
    // selectedContentId는 여기서 null로 설정하지 않음 (Alert에서 사용해야 하므로)
  }, [selectedContentId]);

  // 바텀시트 취소 핸들러
  const handleBottomSheetCancel = useCallback(() => {
    setShowBottomSheet(false);
    setSelectedContentId(null);
  }, []);

  // 삭제 확인 핸들러
  const handleDeleteConfirm = useCallback(async () => {
    console.log("삭제 확인. selectedContentId:", selectedContentId);
    if (!selectedContentId) {
      console.log("selectedContentId가 null입니다");
      return;
    }

    try {
      console.log(
        "삭제 API 호출:",
        `${BACKEND_URL}/contents/${selectedContentId}/my-schedules`,
      );
      const response = await authApi.delete(
        `${BACKEND_URL}/contents/${selectedContentId}/my-schedules`,
      );

      if (response.data.isSuccess) {
        // 삭제 성공 시 목록에서 해당 아이템 제거
        setSchedules((prev) =>
          prev.filter((item) => item.contentId !== selectedContentId),
        );
        console.log("일정 삭제 성공:", selectedContentId);
      } else {
        console.error("일정 삭제 실패:", response.data.message);
      }
    } catch (error) {
      console.error("일정 삭제 API 호출 실패:", error);
    } finally {
      setShowDeleteAlert(false);
      setSelectedContentId(null);
    }
  }, [selectedContentId]);

  // 삭제 취소 핸들러
  const handleDeleteCancel = useCallback(() => {
    setShowDeleteAlert(false);
    setSelectedContentId(null);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <CustomHeader
        title="나의 일정"
        isCommit={false}
        cancel={() => {
          router.back();
        }}
      />

      <View
        className={`flex-1 bg-white ${Platform.OS === "web" ? "pt-8" : ""}`}
      >
        <CalendarProvider date={selectedDate}>
          <CommonCalendar
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
          />

          <FlatList
            className="mx-4 mt-7 flex-1"
            data={schedules}
            renderItem={({ item }) => (
              <ScheduleItem
                item={item}
                onPress={handleScheduleItemPress}
                onMenuPress={handleMenuPress}
                showMenuButton={true}
              />
            )}
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
            refreshControl={
              <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
            }
          />
        </CalendarProvider>
      </View>

      {/* 삭제 바텀 시트 */}
      <DeleteScheduleBottomSheet
        isOpen={showBottomSheet}
        onDelete={handleBottomSheetDelete}
        onClose={() => {
          console.log("바텀시트 onClose 호출됨 - selectedContentId 유지");
          setShowBottomSheet(false);
          // selectedContentId는 건드리지 않음
        }}
        onCancel={handleBottomSheetCancel}
      />

      {/* 삭제 확인 Alert */}
      <DeleteScheduleAlert
        isVisible={showDeleteAlert}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </SafeAreaView>
  );
}
