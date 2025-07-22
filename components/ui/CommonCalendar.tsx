import React, { useCallback, useRef, useState } from "react";

import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { Pressable, StatusBar, View } from "react-native";
import {
  DateData,
  ExpandableCalendar,
  LocaleConfig,
} from "react-native-calendars";

import Chevron from "@/components/icons/Chevron";
import ChevronIndicator from "@/components/icons/ChevronIndicator";
import {
  backgroundColor,
  getCalendarTheme,
  primaryColor,
} from "@/constants/CalendarTheme";

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

export interface ScheduleItem {
  id: number;
  startDate: string;
  endDate: string;
  [key: string]: any;
}

export interface CommonCalendarProps {
  /** 현재 선택된 날짜 (YYYY-MM-DD 형식) */
  selectedDate: string;
  /** 캘린더에 표시할 일정 배열 */
  schedules: ScheduleItem[];
  /** 날짜 선택 시 호출되는 콜백 함수 */
  onDateChange: (dateString: string) => void;
  /** 월 변경 시 호출되는 콜백 함수 (선택적) */
  onMonthChange?: (month: DateData) => void;
  /** 캘린더 확장/축소 상태 변경 시 호출되는 콜백 함수 (선택적) */
  onCalendarToggled?: (expanded: boolean) => void;
  /** 캘린더에서 선택 가능한 최소 날짜 (YYYY-MM-DD 형식, 선택적) */
  minDate?: string;
  /** 캘린더에서 선택 가능한 최대 날짜 (YYYY-MM-DD 형식, 선택적) */
  maxDate?: string;
  /** 현재 월 기준으로 선택 가능한 월 범위 (기본값: 2, 즉 ±2개월) */
  monthRangeLimit?: number;
  /** 상태바 표시 여부 (기본값: true) */
  showStatusBar?: boolean;
  /** 날짜 선택 시 캘린더 자동 닫기 여부 (기본값: false) */
  closeOnDayPress?: boolean;
  /** 캘린더 팬(드래그) 제스처 비활성화 여부 (기본값: true) */
  disablePan?: boolean;
  /** 캘린더 스크롤 애니메이션 활성화 여부 (기본값: true) */
  animateScroll?: boolean;
  /** 캘린더 확장/축소 버튼(손잡이) 숨기기 여부 (기본값: true) */
  hideKnob?: boolean;
}

export default function CommonCalendar({
  selectedDate,
  schedules,
  onDateChange,
  onMonthChange,
  onCalendarToggled,
  monthRangeLimit = 2,
  showStatusBar = true,
  closeOnDayPress = false,
  disablePan = true,
  animateScroll = true,
  hideKnob = true,
  minDate,
  maxDate,
}: CommonCalendarProps) {
  const today = dayjs().tz("Asia/Seoul");
  const currentMonth = today.month() + 1;

  const [isCalendarExpanded, setIsCalendarExpanded] = useState<boolean>(true);
  const [visibleMonth, setVisibleMonth] = useState<number>(currentMonth);

  const calendarRef = useRef<{ toggleCalendarPosition: () => boolean }>(null);

  // 기본 날짜 범위 설정 (props로 전달되지 않은 경우)
  const defaultMinDate =
    minDate ||
    today
      .subtract(monthRangeLimit, "month")
      .startOf("month")
      .format("YYYY-MM-DD");

  const defaultMaxDate =
    maxDate ||
    today.add(monthRangeLimit, "month").endOf("month").format("YYYY-MM-DD");

  // 월 변경 화살표 활성화/비활성화 계산
  const minAllowedMonth = currentMonth - monthRangeLimit;
  const maxAllowedMonth = currentMonth + monthRangeLimit;

  const toggleCalendar = useCallback(() => {
    if (calendarRef.current) calendarRef.current.toggleCalendarPosition();
  }, []);

  const getMarkedDates = useCallback(() => {
    const marked: { [key: string]: any } = {};

    // 모든 일정(schedules)을 순회하며 캘린더 마킹 데이터 생성
    schedules.forEach((event) => {
      const startDate = dayjs(event.startDate);
      const endDate = dayjs(event.endDate);

      // 시작일부터 종료일까지 하루씩 순회하기 위한 현재 날짜 포인터
      let currentDate = startDate;

      // 현재 날짜가 종료일과 같거나 이전인 동안 반복
      while (currentDate.isSameOrBefore(endDate)) {
        const dateString = currentDate.format("YYYY-MM-DD");

        // 해당 날짜에 일정이 있음을 표시 (여러 일정이 있어도 dot 1개만)
        if (!marked[dateString]) {
          marked[dateString] = {
            marked: true,
            dotColor: primaryColor,
          };
        }

        // 다음 날짜로 이동 (하루 증가)
        currentDate = currentDate.add(1, "day");
      }
    });

    return marked;
  }, [schedules]);

  const handleDateChange = (day: DateData) => {
    console.log("Day changed:", day);
    setTimeout(() => onDateChange(day.dateString), 100);
  };

  const handleMonthChange = (month: DateData) => {
    console.log("Month changed:", month);
    if (month.month) setVisibleMonth(month.month);
    onMonthChange?.(month);
  };

  const handleCalendarToggled = (calendarOpened: boolean) => {
    setIsCalendarExpanded(calendarOpened);
    onCalendarToggled?.(calendarOpened);
  };

  return (
    <View>
      {showStatusBar && (
        <StatusBar barStyle="dark-content" backgroundColor={backgroundColor} />
      )}

      <ExpandableCalendar
        ref={calendarRef}
        theme={getCalendarTheme()}
        firstDay={0}
        markedDates={getMarkedDates()}
        markingType="dot"
        monthFormat="yyyy. MM"
        disableArrowLeft={visibleMonth <= minAllowedMonth}
        disableArrowRight={visibleMonth >= maxAllowedMonth}
        minDate={defaultMinDate}
        maxDate={defaultMaxDate}
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
        onDayPress={handleDateChange}
        onMonthChange={handleMonthChange}
        onCalendarToggled={handleCalendarToggled}
        hideKnob={hideKnob}
        closeOnDayPress={closeOnDayPress}
        disablePan={disablePan}
        animateScroll={animateScroll}
        pastScrollRange={3}
        futureScrollRange={3}
      />

      <View className="items-center rounded-b-[32px] bg-white px-4 pb-4 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.04)]">
        <Pressable className="p-2" onPress={toggleCalendar}>
          <ChevronIndicator direction={isCalendarExpanded ? "up" : "down"} />
        </Pressable>
      </View>
    </View>
  );
}
