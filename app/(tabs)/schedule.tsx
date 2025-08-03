import React, { useCallback, useState } from "react";

import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { StatusBar } from "expo-status-bar";
import { FlatList, Text, View } from "react-native";
import { CalendarProvider } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";

import ScheduleEmptyState from "@/components/schedule/ScheduleEmptyState";
import ScheduleItem from "@/components/schedule/ScheduleItem";
import CommonCalendar from "@/components/ui/CommonCalendar";
import Divider from "@/components/ui/Divider";
import { primaryColor } from "@/constants/CalendarTheme";
import {
  initialScheduleData,
  ScheduleItemType,
} from "@/constants/ScheduleData";

// dayjs 플러그인 확장
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

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
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <StatusBar style="dark" />
      <View className="flex-1 bg-[#F2F3F6]">
        <View className="border-b border-[#DCDEE3] bg-white px-4 py-3">
          <Text className="text-center text-lg font-medium text-[#212121]">
            컨텐츠 일정
          </Text>
        </View>

        <CalendarProvider date={selectedDate}>
          <CommonCalendar
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            scheduleData={schedules}
          />

          <FlatList
            className="mx-4 mt-7 flex-1"
            data={getSelectedDateSchedules(selectedDate)}
            renderItem={({ item }) => (
              <ScheduleItem item={item} primaryColor={primaryColor} />
            )}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={ScheduleEmptyState}
            ListHeaderComponent={
              getSelectedDateSchedules(selectedDate).length > 0
                ? () => (
                    <View className="mb-[18px]">
                      <Text className="text-[13px] font-normal text-[#9E9E9E]">
                        {formatSelectedDateHeader(selectedDate)}
                      </Text>
                    </View>
                  )
                : null
            }
            ItemSeparatorComponent={() => (
              <Divider bg="bg-[#EEE]" className="my-3.5" />
            )}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent:
                getSelectedDateSchedules(selectedDate).length === 0
                  ? "center"
                  : "flex-start",
            }}
            removeClippedSubviews={true}
            initialNumToRender={10}
          />
        </CalendarProvider>
      </View>
    </SafeAreaView>
  );
}
