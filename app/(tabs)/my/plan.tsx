import React, { useCallback } from "react";

import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import timezone from "dayjs/plugin/timezone";
import { router } from "expo-router";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { CalendarProvider, ExpandableCalendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";

import CommonCalendar from "@/components/ui/CommonCalendar";
import CustomHeader from "@/components/ui/CustomHeader";
import PostBlock from "@/components/ui/PostBlock";
// import { primaryColor } from "@/constants/CalendarTheme";
import useLikeRefresh from "@/hooks/useLikeRefresh";
import { usePlan } from "@/hooks/usePlan";

// dayjs 플러그인 설정
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export default function Plan() {
  const { refresh, onRefresh } = useLikeRefresh();
  const {
    schedules,
    scheduleDates,
    loading,
    hasMore,
    selectedDate,
    loadMore,
    handleDateChange,
    handleMonthChange,
  } = usePlan();

  const getSelectedDateSchedules = useCallback(() => {
    const selectedDayjs = dayjs(selectedDate);

    return schedules.filter((item) => {
      const startDate = dayjs(item.startDate);
      const endDate = dayjs(item.endDate);

      return (
        selectedDayjs.isSameOrAfter(startDate, "day") &&
        selectedDayjs.isSameOrBefore(endDate, "day")
      );
    });
  }, [schedules, selectedDate]);

  // 월별 일정 데이터를 생성 (schedules 기반)
  const getMonthlySchedules = useCallback(() => {
    return schedules.map((schedule) => ({
      id: schedule.contentId,
      startDate: schedule.startDate,
      endDate: schedule.endDate,
      title: schedule.title,
    }));
  }, [schedules]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <CustomHeader
        title="나의 일정"
        isCommit={false}
        cancel={() => {
          router.replace("/my");
        }}
      />

      <CalendarProvider
        date={selectedDate}
        disableAutoDaySelection={[
          ExpandableCalendar.navigationTypes.MONTH_ARROWS,
          ExpandableCalendar.navigationTypes.WEEK_ARROWS,
          ExpandableCalendar.navigationTypes.MONTH_SCROLL,
          ExpandableCalendar.navigationTypes.WEEK_SCROLL,
        ]}
      >
        <CommonCalendar
          selectedDate={selectedDate}
          schedules={getMonthlySchedules()}
          onDateChange={handleDateChange}
          onMonthChange={(month) => {
            handleMonthChange(month.dateString.slice(0, 7));
          }}
          monthRangeLimit={2}
          closeOnDayPress={false}
          disablePan={true}
          animateScroll={true}
          hideKnob={true}
        />

        {getSelectedDateSchedules().length === 0 && !loading ? (
          <View className="mt-8 flex-1 items-center justify-center">
            <Text className="text-base text-gray-500">
              선택한 날짜에 일정이 없습니다.
            </Text>
          </View>
        ) : (
          <FlatList
            className="mt-4 px-6"
            data={getSelectedDateSchedules()}
            renderItem={({ item }) => (
              <PostBlock
                info={{
                  id: item.contentId,
                  img_url: item.image || "",
                  title: item.title,
                  address: item.address,
                  start_date: item.startDate,
                  end_date: item.endDate,
                }}
              />
            )}
            keyExtractor={(item) => item.contentId.toString()}
            onEndReached={loadMore}
            onEndReachedThreshold={0.8}
            refreshControl={
              <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
            }
            removeClippedSubviews={true}
            initialNumToRender={10}
          />
        )}
      </CalendarProvider>
    </SafeAreaView>
  );
}
