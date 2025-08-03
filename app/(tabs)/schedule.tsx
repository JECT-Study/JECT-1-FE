import React, { useCallback, useState } from "react";

import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ScheduleEmptyState from "@/components/schedule/ScheduleEmptyState";
import ScheduleItem from "@/components/schedule/ScheduleItem";
import CommonCalendar from "@/components/ui/CommonCalendar";
import { primaryColor } from "@/constants/CalendarTheme";
import {
  initialScheduleData,
  ScheduleItemType,
} from "@/constants/ScheduleData";

// dayjs 플러그인 확장
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export default function ScheduleScreen() {
  const [schedules] = useState<ScheduleItemType[]>(initialScheduleData);
  const [selectedDate, setSelectedDate] = useState<string>(
    dayjs().format("YYYY-MM-DD"),
  );

  const getSelectedDateSchedules = useCallback(
    (selectedDate: string): ScheduleItemType[] => {
      const selectedDayjs = dayjs(selectedDate);

      // 선택한 날짜가 이벤트의 startDate와 endDate 사이에 있는지 확인
      return schedules.filter((item: ScheduleItemType) => {
        const startDate = dayjs(item.startDate);
        const endDate = dayjs(item.endDate);

        return (
          selectedDayjs.isSameOrAfter(startDate, "day") &&
          selectedDayjs.isSameOrBefore(endDate, "day")
        );
      });
    },
    [schedules],
  );

  const handleDateChange = useCallback((date: string) => {
    setSelectedDate(date);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="border-b border-[#DCDEE3] bg-white px-4 py-3">
        <Text className="text-center text-lg font-medium text-[#212121]">
          컨텐츠 일정
        </Text>
      </View>

      <CommonCalendar
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        scheduleData={schedules}
      />

      <FlatList
        data={getSelectedDateSchedules(selectedDate)}
        renderItem={({ item }) => (
          <ScheduleItem item={item} primaryColor={primaryColor} />
        )}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={ScheduleEmptyState}
        removeClippedSubviews={true}
        initialNumToRender={10}
      />
    </SafeAreaView>
  );
}
