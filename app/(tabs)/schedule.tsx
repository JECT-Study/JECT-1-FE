import React, { useCallback, useState } from "react";

import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import timezone from "dayjs/plugin/timezone";
import { FlatList, Text, View } from "react-native";
import { CalendarProvider, ExpandableCalendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";

import ScheduleEmptyState from "@/components/schedule/ScheduleEmptyState";
import ScheduleItem from "@/components/schedule/ScheduleItem";
import CommonCalendar from "@/components/ui/CommonCalendar";
import { primaryColor } from "@/constants/CalendarTheme";
import {
  initialScheduleData,
  ScheduleItemType,
} from "@/constants/ScheduleData";

// dayjs 플러그인 설정
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export default function ScheduleScreen() {
  const today = dayjs().tz("Asia/Seoul");
  const kstNow = today.format("YYYY-MM-DD");

  const [selectedDate, setSelectedDate] = useState<string>(kstNow);
  const [schedules, setSchedules] =
    useState<ScheduleItemType[]>(initialScheduleData);

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

  const handleDateChange = (dateString: string) => {
    setSelectedDate(dateString);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="border-b border-[#DCDEE3] bg-white px-4 py-3">
        <Text className="text-center text-lg font-medium text-black">
          나의 일정
        </Text>
      </View>

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
          schedules={schedules}
          onDateChange={handleDateChange}
          monthRangeLimit={2}
          showStatusBar={true}
          closeOnDayPress={false}
          disablePan={true}
          animateScroll={true}
          hideKnob={true}
        />

        <FlatList
          className="mt-4"
          data={getSelectedDateSchedules(selectedDate)}
          renderItem={({ item }) => (
            <ScheduleItem item={item} primaryColor={primaryColor} />
          )}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={ScheduleEmptyState}
          removeClippedSubviews={true}
          initialNumToRender={10}
        />
      </CalendarProvider>
    </SafeAreaView>
  );
}
