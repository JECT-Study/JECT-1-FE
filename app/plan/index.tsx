import React, { useCallback, useEffect, useState } from "react";

import dayjs from "dayjs";
import { router } from "expo-router";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { CalendarProvider } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";

import ScheduleEmptyState from "@/components/schedule/ScheduleEmptyState";
import ScheduleItem from "@/components/schedule/ScheduleItem";
import ActionBottomSheet from "@/components/ui/ActionBottomSheet";
import CommonCalendar from "@/components/ui/CommonCalendar";
import CommonModal from "@/components/ui/CommonModal";
import CustomHeader from "@/components/ui/CustomHeader";
import Divider from "@/components/ui/Divider";
import Toast from "@/components/ui/Toast";
import { BACKEND_URL } from "@/constants/ApiUrls";
import { ScheduleItemType } from "@/constants/ScheduleData";
import { authApi } from "@/features/axios/axiosInstance";
import { ScheduleApiResponse } from "@/types/schedule";

const SCHEDULE_LIMIT = 10;

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
  const [showBottomSheet, setShowBottomSheet] = useState<boolean>(false);

  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
  const [selectedContentId, setSelectedContentId] = useState<number | null>(
    null,
  );
  const [showToast, setShowToast] = useState<boolean>(false);

  // 스케줄 데이터 API 호출 함수
  const fetchScheduleData = useCallback(
    async (date: string, page: number = 0, isLoadMore: boolean = false) => {
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
        // 토스트 표시
        setShowToast(true);
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

  // 토스트 숨김 핸들러
  const handleToastHide = useCallback(() => {
    setShowToast(false);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <CustomHeader
        title="나의 일정"
        isCommit={false}
        separator
        cancel={() => {
          router.back();
        }}
      />

      <View className="flex-1 bg-white">
        <CalendarProvider date={selectedDate}>
          <CommonCalendar
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
          />

          <FlatList
            className="mx-4 flex-1"
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
                </View>
              ) : (
                <ScheduleEmptyState />
              )
            }
            ListHeaderComponent={
              schedules.length > 0 ? (
                <View className="mb-4">
                  <Text className="text-[13px] font-normal text-[#9E9E9E]">
                    {formatSelectedDateHeader(selectedDate)}
                  </Text>
                </View>
              ) : null
            }
            ListFooterComponent={
              isLoadingMore && !isLoading ? (
                <View className="flex-row items-center justify-center py-4">
                  <ActivityIndicator size="large" color="#6C4DFF" />
                </View>
              ) : null
            }
            ItemSeparatorComponent={() => (
              <Divider bg="bg-[#EEE]" className="my-3" />
            )}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: schedules.length === 0 ? "center" : "flex-start",
              paddingVertical: 20,
            }}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            removeClippedSubviews={true}
            initialNumToRender={10}
            showsVerticalScrollIndicator={false}
          />
        </CalendarProvider>
      </View>

      {/* 삭제 바텀 시트 */}
      <ActionBottomSheet
        isOpen={showBottomSheet}
        onClose={() => {
          console.log("바텀시트 onClose 호출됨 - selectedContentId 유지");
          setShowBottomSheet(false);
          // selectedContentId는 건드리지 않음
        }}
        actions={[
          {
            label: "삭제하기",
            onPress: handleBottomSheetDelete,
            color: "#EF4444", // red-500
          },
          {
            label: "취소",
            onPress: handleBottomSheetCancel,
            color: "#3B82F6", // blue-500
          },
        ]}
        snapPoint={200}
      />

      {/* 삭제 확인 모달 */}
      <CommonModal
        visible={showDeleteAlert}
        onClose={handleDeleteCancel}
        mainTitle="일정을 삭제하시겠어요?"
        subTitle="삭제된 일정은 복구할 수 없어요."
        cancelText="취소"
        confirmText="삭제"
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />

      {/* 토스트 */}
      <Toast
        visible={showToast}
        message="일정이 삭제되었습니다."
        onHide={handleToastHide}
      />
    </SafeAreaView>
  );
}
