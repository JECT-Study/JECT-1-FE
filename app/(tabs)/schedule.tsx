import React, { useRef, useCallback, useState } from "react";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import {
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  FlatList,
} from "react-native";
import {
  ExpandableCalendar,
  CalendarProvider,
  LocaleConfig,
} from "react-native-calendars";

import ScheduleEmptyState from "@/components/schedule/ScheduleEmptyState";
import ScheduleItem from "@/components/schedule/ScheduleItem";
import {
  getCalendarTheme,
  primaryColor,
  backgroundColor,
} from "@/constants/CalendarTheme";
import {
  initialScheduleData,
  ScheduleItemType,
  ScheduleByDate,
  ScheduleData,
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

export default function ScheduleScreen() {
  const kstNow = dayjs().tz("Asia/Seoul").format("YYYY-MM-DD");

  const [isCalendarExpanded, setIsCalendarExpanded] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<string>(kstNow);
  const [schedules, setSchedules] = useState<ScheduleData>(initialScheduleData);

  const calendarRef = useRef<{ toggleCalendarPosition: () => boolean }>(null);

  const toggleCalendar = useCallback(() => {
    if (calendarRef.current) {
      // 캘린더의 toggleCalendarPosition 메서드 호출하여 상태 변경
      const newState = calendarRef.current.toggleCalendarPosition();
      setIsCalendarExpanded(newState);
    }
  }, []);

  const getMarkedDates = useCallback(() => {
    const marked: { [key: string]: any } = {};

    schedules.forEach((item: ScheduleByDate) => {
      marked[item.title] = {
        marked: true,
        dotColor: primaryColor,
      };
    });

    return marked;
  }, [schedules]);

  const getSelectedDateSchedules = useCallback(
    (selectedDate: string): ScheduleItemType[] => {
      const dateItem = schedules.find(
        (item: ScheduleByDate) => item.title === selectedDate,
      );
      return dateItem ? dateItem.data : [];
    },
    [schedules],
  );

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor={backgroundColor} />
      <View className="border-b border-gray-100 bg-white px-4 py-3">
        <Text className="text-left text-2xl font-bold text-gray-900">
          일정 별 컨텐츠
        </Text>
      </View>
      <CalendarProvider date={selectedDate}>
        <ExpandableCalendar
          ref={calendarRef}
          theme={getCalendarTheme()}
          firstDay={0} // 주의 시작 요일 (0: 일요일, 1: 월요일)
          markedDates={getMarkedDates()} // 일정 마킹 및 선택된 날짜 표시
          onDayPress={(day) => {
            console.log("Day changed:", day);
            // 캘린더 내부 처리 완료 후 상태 업데이트 (렌더링 충돌 방지)
            setTimeout(() => {
              setSelectedDate(day.dateString);
            }, 10);
          }}
          onMonthChange={(month) => {
            const normalizedDate = {
              ...month,
              day: 1,
              dateString: `${month.year}-${month.month.toString().padStart(2, "0")}-01`,
            };
            console.log("Month changed:", normalizedDate);
            // 새로운 월의 1일로 선택된 날짜 업데이트
            setSelectedDate(normalizedDate.dateString);
          }}
          hideKnob={true} // 캘린더 상단의 접기/펼치기 손잡이 숨김
          closeOnDayPress={false} // 날짜 선택 시 캘린더 자동 접기 비활성화
          disablePan={true} // 팬 제스처(드래그) 비활성화로 스크롤 충돌 방지
        />
        <TouchableOpacity
          className="items-center border-b border-gray-100 bg-white px-4 py-3"
          onPress={toggleCalendar}
        >
          <Text className="text-base font-semibold text-[#816BFF]">
            {isCalendarExpanded ? "접기" : "펼치기"}
          </Text>
        </TouchableOpacity>
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
