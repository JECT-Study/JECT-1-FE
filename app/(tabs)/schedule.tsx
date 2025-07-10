import React, { useCallback, useRef, useState } from "react";

import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { FlatList, Pressable, StatusBar, Text, View } from "react-native";
import {
  CalendarProvider,
  DateData,
  ExpandableCalendar,
  LocaleConfig,
} from "react-native-calendars";

import Chevron from "@/components/icons/Chevron";
import ChevronIndicator from "@/components/icons/ChevronIndicator";
import ScheduleEmptyState from "@/components/schedule/ScheduleEmptyState";
import ScheduleItem from "@/components/schedule/ScheduleItem";
import {
  backgroundColor,
  getCalendarTheme,
  primaryColor,
} from "@/constants/CalendarTheme";
import {
  initialScheduleData,
  ScheduleItemType,
} from "@/constants/ScheduleData";

// 한국어 로케일 설정
LocaleConfig.locales.ko = {
  monthNames: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],
  dayNames: [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ],
  dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
  today: "오늘",
};

// 기본 로케일을 한국어로 설정
LocaleConfig.defaultLocale = "ko";

// dayjs 플러그인 설정
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const eventColors = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E9",
];

export default function ScheduleScreen() {
  // 오늘 날짜 기준 설정
  const today = dayjs().tz("Asia/Seoul"); // 2025-07-09T15:30:00+09:00
  const kstNow = today.format("YYYY-MM-DD"); // "2025-07-09"
  const currentMonth = today.month() + 1; // 7 (1-12 범위)

  const [isCalendarExpanded, setIsCalendarExpanded] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<string>(kstNow);
  const [visibleMonth, setVisibleMonth] = useState<number>(currentMonth);
  const [schedules, setSchedules] =
    useState<ScheduleItemType[]>(initialScheduleData);

  const calendarRef = useRef<{ toggleCalendarPosition: () => boolean }>(null);

  // kstNow의 월을 기준으로 화살표 활성화/비활성화 계산
  const minAllowedMonth = currentMonth - 2;
  const maxAllowedMonth = currentMonth + 2;

  // 실제 날짜 범위 제한 (현재 날짜 기준 ±2달)
  const minDate = today
    .subtract(2, "month")
    .startOf("month")
    .format("YYYY-MM-DD"); // "2025-05-01"
  const maxDate = today.add(2, "month").endOf("month").format("YYYY-MM-DD"); // "2025-09-30"

  const toggleCalendar = useCallback(() => {
    if (calendarRef.current) calendarRef.current.toggleCalendarPosition();
  }, []);

  const getMarkedDates = useCallback(() => {
    const marked: { [key: string]: any } = {};

    // 모든 일정(schedules)을 순회하며 캘린더 마킹 데이터 생성
    schedules.forEach((event, index) => {
      const startDate = dayjs(event.startDate);
      const endDate = dayjs(event.endDate);

      const color = eventColors[index % eventColors.length];

      // 시작일부터 종료일까지 하루씩 순회하기 위한 현재 날짜 포인터
      let currentDate = startDate;

      // 현재 날짜가 종료일과 같거나 이전인 동안 반복
      while (currentDate.isSameOrBefore(endDate)) {
        const dateString = currentDate.format("YYYY-MM-DD");

        // 해당 날짜의 마킹 데이터가 없으면 초기화
        if (!marked[dateString]) marked[dateString] = { periods: [] };

        // 현재 날짜에 대한 period 마킹 객체 생성
        const period = {
          startingDay: currentDate.isSame(startDate, "day"),
          endingDay: currentDate.isSame(endDate, "day"),
          color: color,
        };

        // 현재 날짜의 periods 배열에 생성한 period 추가
        marked[dateString].periods.push(period);

        // 다음 날짜로 이동 (하루 증가)
        currentDate = currentDate.add(1, "day");
      }
    });

    return marked;
  }, [schedules]);

  const test = getMarkedDates();
  console.log(test);

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

  const handleDateChange = (dateString: string) => setSelectedDate(dateString);

  return (
    <View className="flex-1 bg-[#F1F3F5]">
      <StatusBar barStyle="dark-content" backgroundColor={backgroundColor} />
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
        <ExpandableCalendar
          ref={calendarRef}
          theme={getCalendarTheme()}
          firstDay={0}
          markedDates={getMarkedDates()}
          markingType="multi-period"
          monthFormat="yyyy. MM"
          disableArrowLeft={visibleMonth <= minAllowedMonth}
          disableArrowRight={visibleMonth >= maxAllowedMonth}
          minDate={minDate}
          maxDate={maxDate}
          renderArrow={(direction) => {
            const isDisabled =
              direction === "left"
                ? visibleMonth <= minAllowedMonth
                : visibleMonth >= maxAllowedMonth;
            const arrowColor = isDisabled ? "#D9D9D9" : "#6D6D6D";

            return (
              <View>
                <Chevron direction={direction} color={arrowColor} />
              </View>
            );
          }}
          onDayPress={(day: DateData) => {
            console.log("Day changed:", day);
            handleDateChange(day.dateString);
          }}
          onMonthChange={(month: DateData) => {
            console.log("Month changed:", month);
            if (month.month) setVisibleMonth(month.month);
          }}
          onCalendarToggled={(calendarOpened: boolean) =>
            setIsCalendarExpanded(calendarOpened)
          }
          hideKnob={true}
          closeOnDayPress={false}
          disablePan={true}
          animateScroll={true}
          pastScrollRange={3}
          futureScrollRange={3}
        />

        <View className="items-center rounded-b-[32px] bg-white px-4 pb-4 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.04)]">
          <Pressable className="p-2" onPress={toggleCalendar}>
            <ChevronIndicator direction={isCalendarExpanded ? "up" : "down"} />
          </Pressable>
        </View>

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
    </View>
  );
}
