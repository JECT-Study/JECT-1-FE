import React, { useCallback, useEffect, useRef, useState } from "react";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import {
  FlatList,
  Pressable,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  CalendarProvider,
  DateData,
  ExpandableCalendar,
  LocaleConfig,
} from "react-native-calendars";

import Chevron from "@/components/icons/Chevron";
import ChevronIndicator from "@/components/icons/ChevronIndicator";
import CustomDayComponent from "@/components/schedule/CustomDayComponent";
import ScheduleEmptyState from "@/components/schedule/ScheduleEmptyState";
import ScheduleItem from "@/components/schedule/ScheduleItem";
import {
  backgroundColor,
  getCalendarTheme,
  primaryColor,
} from "@/constants/CalendarTheme";
import {
  initialScheduleData,
  ScheduleByDate,
  ScheduleData,
  ScheduleItemType,
} from "@/constants/ScheduleData";
import { useThrottle } from "@/hooks/useThrottle";

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

const getPreviousMonthDate = (date: string) => {
  return dayjs(date).subtract(1, "month").startOf("month").format("YYYY-MM-DD");
};

const getNextMonthDate = (date: string) => {
  return dayjs(date).add(1, "month").startOf("month").format("YYYY-MM-DD");
};

export default function ScheduleScreen() {
  const kstNow = dayjs().tz("Asia/Seoul").format("YYYY-MM-DD");

  const [isCalendarExpanded, setIsCalendarExpanded] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<string>(kstNow);
  const [schedules, setSchedules] = useState<ScheduleData>(initialScheduleData);
  const [canGoToPreviousMonth, setCanGoToPreviousMonth] =
    useState<boolean>(true);
  const [canGoToNextMonth, setCanGoToNextMonth] = useState<boolean>(true);

  const calendarRef = useRef<{ toggleCalendarPosition: () => boolean }>(null);

  const throttle = useThrottle();

  const currentMonth = dayjs().tz("Asia/Seoul");

  const minDate = currentMonth
    .subtract(2, "month")
    .startOf("month")
    .format("YYYY-MM-DD");

  const maxDate = currentMonth
    .add(2, "month")
    .endOf("month")
    .format("YYYY-MM-DD");

  useEffect(() => {
    const previousMonthDate = getPreviousMonthDate(selectedDate);
    const nextMonthDate = getNextMonthDate(selectedDate);

    setCanGoToPreviousMonth(!dayjs(previousMonthDate).isBefore(dayjs(minDate)));
    setCanGoToNextMonth(!dayjs(nextMonthDate).isAfter(dayjs(maxDate)));
  }, [selectedDate, minDate, maxDate]);

  const toggleCalendar = useCallback(() => {
    if (calendarRef.current) {
      // 캘린더의 toggleCalendarPosition 메서드 호출하여 상태 변경
      const newState = calendarRef.current.toggleCalendarPosition();
      // 캘린더 내부 애니메이션과 동기화를 위한 최소 지연
      setTimeout(() => {
        setIsCalendarExpanded(newState);
      }, 300);
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

  const throttledMonthChange = (dateString: string) => {
    throttle(() => {
      setSelectedDate((prevDate) => {
        return prevDate !== dateString ? dateString : prevDate;
      });
    }, 100);
  };

  const goToPreviousMonth = () => {
    const newDate = getPreviousMonthDate(selectedDate);

    if (dayjs(newDate).isBefore(dayjs(minDate))) {
      return;
    }

    throttledMonthChange(newDate);
  };

  const goToNextMonth = () => {
    const newDate = getNextMonthDate(selectedDate);

    if (dayjs(newDate).isAfter(dayjs(maxDate))) {
      return;
    }

    throttledMonthChange(newDate);
  };

  return (
    <View className="flex-1 bg-[#F1F3F5]">
      <StatusBar barStyle="dark-content" backgroundColor={backgroundColor} />
      <View className="border-b border-[#DCDEE3] bg-white px-4 py-3">
        <Text className="text-center text-lg font-medium text-black">
          나의 일정
        </Text>
      </View>

      <View className="flex-row items-center justify-center bg-white px-4 py-3">
        <TouchableOpacity
          className="px-4 py-2"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={goToPreviousMonth}
          disabled={!canGoToPreviousMonth}
        >
          <Chevron
            direction="left"
            size={20}
            color={canGoToPreviousMonth ? "#000000" : "#D9D9D9"}
          />
        </TouchableOpacity>

        <Text className="mx-1.5 text-lg font-semibold text-gray-900">
          {dayjs(selectedDate).format("YYYY. MM")}
        </Text>

        <TouchableOpacity
          className="px-4 py-2"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={goToNextMonth}
          disabled={!canGoToNextMonth}
        >
          <Chevron
            direction="right"
            size={20}
            color={canGoToNextMonth ? "#000000" : "#D9D9D9"}
          />
        </TouchableOpacity>
      </View>

      <CalendarProvider date={selectedDate}>
        <ExpandableCalendar
          ref={calendarRef}
          theme={getCalendarTheme()}
          firstDay={0}
          markedDates={getMarkedDates()}
          renderHeader={() => null}
          hideArrows={true}
          minDate={minDate}
          maxDate={maxDate}
          dayComponent={(props: any) => (
            <CustomDayComponent
              {...props}
              primaryColor={primaryColor}
              onDayPress={(day: DateData) => {
                console.log("Day changed:", day);
                throttledMonthChange(day.dateString);
              }}
            />
          )}
          onMonthChange={(month: DateData) => {
            const normalizedDate = {
              ...month,
              day: 1,
              dateString: `${month.year}-${month.month.toString().padStart(2, "0")}-01`,
            };
            console.log("Month changed:", normalizedDate);

            throttledMonthChange(normalizedDate.dateString);
          }}
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
