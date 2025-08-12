import React, { useCallback } from "react";

import dayjs from "dayjs";
import { Pressable, Text, View } from "react-native";

import CalendarArrow from "@/components/icons/CalendarArrow";

interface CalendarHeaderProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  /** 최소 날짜 (YYYY-MM-DD 형식) */
  minDate?: string;
  /** 최대 날짜 (YYYY-MM-DD 형식) */
  maxDate?: string;
}

// 년월 포맷팅 함수
const formatYearMonth = (dateString: string) => {
  const date = dayjs(dateString);
  const year = date.year();
  const month = String(date.month() + 1).padStart(2, "0");
  return { year, month };
};

export default function CalendarHeader({
  selectedDate,
  setSelectedDate,
  minDate,
  maxDate,
}: CalendarHeaderProps) {
  const { year, month } = formatYearMonth(selectedDate);

  // 기본값: 오늘 기준 ±3개월
  const today = dayjs();
  const defaultMinMonth = today.subtract(3, "month").format("YYYY-MM");
  const defaultMaxMonth = today.add(3, "month").format("YYYY-MM");

  // minDate/maxDate가 제공되면 해당 값 사용, 아니면 기본값 사용
  const minMonth = minDate ? dayjs(minDate).format("YYYY-MM") : defaultMinMonth;
  const maxMonth = maxDate ? dayjs(maxDate).format("YYYY-MM") : defaultMaxMonth;
  const currentMonthStr = dayjs(selectedDate).format("YYYY-MM");

  // 이전/다음 월 이동 가능 여부 체크
  const canGoPrevious = currentMonthStr > minMonth;
  const canGoNext = currentMonthStr < maxMonth;

  // 이전 월로 이동
  const goToPreviousMonth = useCallback(() => {
    if (!canGoPrevious) return;

    // 이전 월의 1일로 selectedDate 업데이트
    const firstDayOfPreviousMonth = dayjs(selectedDate)
      .subtract(1, "month")
      .date(1)
      .format("YYYY-MM-DD");
    setSelectedDate(firstDayOfPreviousMonth);
  }, [selectedDate, setSelectedDate, canGoPrevious]);

  // 다음 월로 이동
  const goToNextMonth = useCallback(() => {
    if (!canGoNext) return;

    // 다음 월의 1일로 selectedDate 업데이트
    const firstDayOfNextMonth = dayjs(selectedDate)
      .add(1, "month")
      .date(1)
      .format("YYYY-MM-DD");
    setSelectedDate(firstDayOfNextMonth);
  }, [selectedDate, setSelectedDate, canGoNext]);

  return (
    <View className="my-2 flex-row items-center justify-between px-4 py-2.5">
      <Pressable
        onPress={goToPreviousMonth}
        className="p-2"
        disabled={!canGoPrevious}
      >
        <CalendarArrow
          direction="left"
          color={canGoPrevious ? "#424242" : "#BDBDBD"}
        />
      </Pressable>

      <Text className="mx-1 text-xl font-semibold text-[#424242]">
        {year}. {month}
      </Text>

      <Pressable onPress={goToNextMonth} className="p-2" disabled={!canGoNext}>
        <CalendarArrow
          direction="right"
          color={canGoNext ? "#424242" : "#BDBDBD"}
        />
      </Pressable>
    </View>
  );
}
