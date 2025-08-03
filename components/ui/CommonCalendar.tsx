import React, { useCallback, useRef, useState } from "react";

import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { Pressable, Text, View } from "react-native";
import {
  DateData,
  ExpandableCalendar,
  LocaleConfig,
} from "react-native-calendars";

import CalendarArrow from "@/components/icons/CalendarArrow";
import ChevronIndicator from "@/components/icons/ChevronIndicator";
import { getCalendarTheme, primaryColor } from "@/constants/CalendarTheme";
import { ScheduleItemType } from "@/constants/ScheduleData";

// dayjs 플러그인 확장
dayjs.extend(isSameOrBefore);

// 기본 로케일을 한국어로 설정 - 모든 캘린더 컴포넌트에서 한국어 사용
LocaleConfig.defaultLocale = "ko";

interface CommonCalendarProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  scheduleData: ScheduleItemType[];
}

// 년월 포맷팅 함수
const formatYearMonth = (dateString: string) => {
  const date = dayjs(dateString);
  const year = date.year();
  const month = String(date.month() + 1).padStart(2, "0");
  return { year, month };
};

// 일정 마킹을 위한 markedDates 생성 함수
const getMarkedDates = (
  selectedDate: string,
  scheduleData: ScheduleItemType[],
) => {
  const marked: { [key: string]: any } = {};

  // 일정 데이터로부터 마킹 생성
  scheduleData.forEach((event) => {
    const startDate = dayjs(event.startDate);
    const endDate = dayjs(event.endDate);

    // 시작일부터 종료일까지 하루씩 순회
    let currentDate = startDate;
    while (currentDate.isSameOrBefore(endDate)) {
      const dateString = currentDate.format("YYYY-MM-DD");

      // 해당 날짜에 일정이 있음을 표시
      if (!marked[dateString]) {
        // 선택된 날짜인 경우 하얀색 점으로 표시
        const isSelected = dateString === selectedDate;
        marked[dateString] = {
          marked: true,
          dotColor: isSelected ? "#ffffff" : primaryColor,
        };
      }

      currentDate = currentDate.add(1, "day");
    }
  });

  return marked;
};

const CalendarHeader = ({
  selectedDate,
  setSelectedDate,
}: {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}) => {
  const { year, month } = formatYearMonth(selectedDate);

  // 오늘 월 기준으로 최소/최대 월 계산
  const today = dayjs();
  const minMonth = today.subtract(3, "month").format("YYYY-MM");
  const maxMonth = today.add(3, "month").format("YYYY-MM");
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
      .startOf("month")
      .format("YYYY-MM-DD");
    setSelectedDate(firstDayOfPreviousMonth);
  }, [selectedDate, setSelectedDate, canGoPrevious]);

  // 다음 월로 이동
  const goToNextMonth = useCallback(() => {
    if (!canGoNext) return;

    // 다음 월의 1일로 selectedDate 업데이트
    const firstDayOfNextMonth = dayjs(selectedDate)
      .add(1, "month")
      .startOf("month")
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
};

export default function CommonCalendar({
  selectedDate,
  onDateChange,
  scheduleData,
}: CommonCalendarProps) {
  // 캘린더 확장/축소 상태 관리
  const [isCalendarExpanded, setIsCalendarExpanded] = useState<boolean>(true);
  // 캘린더 토글 중인지 여부 (손잡이 비활성화용)
  const [isToggling, setIsToggling] = useState<boolean | null>(null);

  // 캘린더 컴포넌트 참조 (확장/축소 제어용)
  const calendarRef = useRef<{ toggleCalendarPosition: () => boolean }>(null);

  // 일정 마킹을 위한 markedDates 생성
  const markedDates = getMarkedDates(selectedDate, scheduleData);

  // 날짜 선택 시 호출되는 핸들러 - 선택된 날짜 상태 업데이트
  const handleDateChange = useCallback(
    (day: DateData) => {
      onDateChange(day.dateString);
    },
    [onDateChange],
  );

  // 월 변경 시 호출되는 핸들러 - 월이 바뀔 때마다 실행
  const handleMonthChange = useCallback(
    (month: DateData) => {
      console.log("월 변경");
      // 현재 selectedDate의 월과 다른 경우에만 업데이트
      const currentSelectedMonth = dayjs(selectedDate).format("YYYY-MM");
      const newMonth = dayjs(month.dateString).format("YYYY-MM");

      if (currentSelectedMonth !== newMonth) {
        // 변경된 월의 1일로 selectedDate 업데이트
        const firstDayOfMonth = dayjs(month.dateString)
          .startOf("month")
          .format("YYYY-MM-DD");
        onDateChange(firstDayOfMonth);
      }
    },
    [selectedDate, onDateChange],
  );

  // 캘린더 확장/축소 상태 변경 시 호출되는 핸들러
  const handleCalendarToggled = useCallback((calendarOpened: boolean) => {
    setIsCalendarExpanded(calendarOpened);
    setIsToggling(null);
  }, []);

  // 커스텀 손잡이 클릭 시 캘린더 확장/축소 토글
  const toggleCalendar = useCallback(() => {
    if (calendarRef.current) {
      const isOpen = calendarRef.current.toggleCalendarPosition();
      setIsToggling(isOpen);
    }
  }, []);

  const renderHeader = useCallback(() => {
    return (
      <CalendarHeader
        selectedDate={selectedDate}
        setSelectedDate={onDateChange}
      />
    );
  }, [selectedDate, onDateChange]);

  return (
    <View>
      <ExpandableCalendar
        ref={calendarRef}
        theme={getCalendarTheme()}
        firstDay={0} // 주의 첫 번째 요일 설정 (0: 일요일, 1: 월요일)
        renderHeader={renderHeader} // 커스텀 헤더 렌더링
        hideArrows={true} // 기본 화살표 숨김 (커스텀 헤더에서 처리)
        onDayPress={handleDateChange} // 날짜 선택 시 실행할 콜백 함수
        onMonthChange={handleMonthChange} // 월 변경 시 실행할 콜백 함수
        onCalendarToggled={handleCalendarToggled} // 캘린더 확장/축소 시 실행할 콜백 함수
        hideKnob={true} // 기본 캘린더 확장/축소 손잡이 숨김 (커스텀 손잡이 사용)
        closeOnDayPress={false} // 날짜 선택 시 캘린더 자동 닫기 여부 (false: 닫지 않음)
        disablePan={false} // 팬(드래그) 제스처 비활성화 여부 (false: 활성화)
        animateScroll={true} // 스크롤 애니메이션 활성화 여부 (true: 부드러운 애니메이션)
        pastScrollRange={3} // 과거 방향으로 스크롤 가능한 개월 수 (12개월 전까지)
        futureScrollRange={3} // 미래 방향으로 스크롤 가능한 개월 수 (12개월 후까지)
        markedDates={markedDates} // 일정 마킹 표시 (선택된 날짜는 하얀색 점)
        markingType="dot" // 일정이 있는 날짜에 점(dot) 표시
      />

      <View
        className={`items-center rounded-b-[32px] bg-white px-4 pb-2 pt-4 shadow-[0px_2px_14px_0px_rgba(0,0,0,0.12)]`}
      >
        <Pressable
          disabled={isToggling !== null}
          className={`p-2 ${isToggling !== null ? "opacity-50" : ""}`}
          onPress={toggleCalendar}
        >
          <ChevronIndicator direction={isCalendarExpanded ? "up" : "down"} />
        </Pressable>
      </View>
    </View>
  );
}
