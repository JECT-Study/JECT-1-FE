import React, { useCallback, useMemo, useRef, useState } from "react";

import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import dayjs from "dayjs";
import { Pressable, Text, View } from "react-native";
import { Calendar, DateData, LocaleConfig } from "react-native-calendars";

import { getCalendarTheme } from "@/constants/CalendarTheme";

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
LocaleConfig.defaultLocale = "ko";

interface DatePickerBottomSheetProps {
  /** 바텀시트 표시 여부 */
  isOpen: boolean;
  /** 바텀시트 닫기 함수 */
  onClose: () => void;
  /** 선택 가능한 시작 날짜 */
  startDate: string;
  /** 선택 가능한 종료 날짜 */
  endDate: string;
  /** 날짜 선택 시 호출되는 콜백 */
  onDateSelect: (selectedDate: string) => void;
  /** 이벤트 제목 */
  eventTitle?: string;
}

export default function DatePickerBottomSheet({
  isOpen,
  onClose,
  startDate,
  endDate,
  onDateSelect,
  eventTitle,
}: DatePickerBottomSheetProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState<string>(
    dayjs(startDate).format("YYYY-MM"),
  );

  const bottomSheetRef = useRef<BottomSheet>(null);

  // 동적 사이징을 위해 snapPoints 제거 (enableDynamicSizing={true} 사용)

  // 바텀시트 열기/닫기 처리
  React.useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.expand();
      // 바텀시트가 열릴 때마다 startDate의 월로 리셋하고 선택된 날짜 초기화
      setCurrentMonth(dayjs(startDate).format("YYYY-MM"));
      setSelectedDate(null);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isOpen, startDate]);

  // 날짜 선택 처리
  const handleDayPress = useCallback((day: DateData) => {
    setSelectedDate(day.dateString);
  }, []);

  // 월 변경 처리
  const handleMonthChange = useCallback((month: DateData) => {
    setCurrentMonth(month.dateString.substring(0, 7)); // YYYY-MM 형식
  }, []);

  // 월 이동 제한 계산
  const monthNavigationDisabled = useMemo(() => {
    const startMonth = dayjs(startDate).format("YYYY-MM");
    const endMonth = dayjs(endDate).format("YYYY-MM");
    const current = currentMonth;

    return {
      disableArrowLeft: current <= startMonth,
      disableArrowRight: current >= endMonth,
    };
  }, [startDate, endDate, currentMonth]);

  // 확인 버튼 처리
  const handleConfirm = useCallback(() => {
    if (selectedDate) {
      onDateSelect(selectedDate);
      onClose();
    }
  }, [selectedDate, onDateSelect, onClose]);

  // 마킹된 날짜들 생성
  const markedDates = useMemo(() => {
    const marked: { [key: string]: any } = {};

    // 선택 가능한 날짜 범위 설정
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    let current = start;

    // 시작일부터 종료일까지 모든 날짜를 활성화
    while (current.isSameOrBefore(end)) {
      const dateString = current.format("YYYY-MM-DD");
      marked[dateString] = {
        disabled: false,
        disableTouchEvent: false,
      };
      current = current.add(1, "day");
    }

    // 선택된 날짜 표시
    if (selectedDate) {
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: "#6C4DFF",
        selectedTextColor: "#FFFFFF",
      };
    }

    return marked;
  }, [startDate, endDate, selectedDate]);

  // 날짜 포맷팅 함수
  const formatDateRange = () => {
    const start = dayjs(startDate).format("YYYY.MM.DD");
    const end = dayjs(endDate).format("YYYY.MM.DD");
    return `${start} - ${end}`;
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={isOpen ? 0 : -1}
      onClose={onClose}
      enablePanDownToClose
      enableDynamicSizing={true}
      backgroundStyle={{ backgroundColor: "#FFFFFF" }}
      handleIndicatorStyle={{ backgroundColor: "#E0E0E0" }}
    >
      <BottomSheetView className="p-4">
        {/* 헤더 */}
        <View className="mb-6">
          <Text className="mb-2 text-xl font-bold text-gray-900">
            날짜를 선택해주세요
          </Text>
          {eventTitle && (
            <Text className="mb-2 text-lg font-medium text-gray-700">
              {eventTitle}
            </Text>
          )}
          <Text className="text-sm text-gray-500">
            선택 가능한 기간: {formatDateRange()}
          </Text>
        </View>

        {/* 캘린더 */}

        <Calendar
          theme={getCalendarTheme()}
          firstDay={0}
          monthFormat="yyyy년 MM월"
          current={startDate}
          minDate={startDate}
          maxDate={endDate}
          markedDates={markedDates}
          onDayPress={handleDayPress}
          onMonthChange={handleMonthChange}
          disableAllTouchEventsForDisabledDays
          hideExtraDays
          disableArrowLeft={monthNavigationDisabled.disableArrowLeft}
          disableArrowRight={monthNavigationDisabled.disableArrowRight}
          disableMonthChange={false}
          enableSwipeMonths={false}
        />

        {/* 선택된 날짜 표시 */}
        {selectedDate && (
          <View className="my-4 rounded-lg bg-gray-50 p-4">
            <Text className="text-center text-base font-medium text-gray-700">
              선택된 날짜:{" "}
              {dayjs(selectedDate).format("YYYY년 MM월 DD일 (ddd)")}
            </Text>
          </View>
        )}

        {/* 하단 버튼들 */}
        <View className="flex-row gap-3 pb-32 pt-4">
          <Pressable
            className="flex-1 rounded-lg border border-gray-300 py-4"
            onPress={onClose}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <Text className="text-center text-base font-medium text-gray-700">
              취소
            </Text>
          </Pressable>

          <Pressable
            className={`flex-1 rounded-lg py-4 ${
              selectedDate ? "bg-[#6C4DFF]" : "bg-gray-300"
            }`}
            onPress={handleConfirm}
            disabled={!selectedDate}
            style={({ pressed }) => [
              { opacity: pressed && selectedDate ? 0.8 : 1 },
            ]}
          >
            <Text
              className={`text-center text-base font-medium ${
                selectedDate ? "text-white" : "text-gray-500"
              }`}
            >
              확인
            </Text>
          </Pressable>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}
