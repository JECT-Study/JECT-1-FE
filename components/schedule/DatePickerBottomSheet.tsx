import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import dayjs from "dayjs";
import { Alert, Platform, Pressable, Text, View } from "react-native";
import { Calendar, DateData, LocaleConfig } from "react-native-calendars";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CalendarHeader from "@/components/ui/CalendarHeader";
import { CustomDay } from "@/components/ui/CustomDay";
import { BACKEND_URL } from "@/constants/ApiUrls";
import { getCalendarTheme } from "@/constants/CalendarTheme";
import { authApi } from "@/features/axios/axiosInstance";

// 한국어 로케일 설정
LocaleConfig.locales["ko"] = {
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
  /** 이벤트 제목 */
  eventTitle?: string;
  /** 콘텐츠 ID */
  contentId: string;
  /** 일정 추가 성공 콜백 */
  onScheduleAdded?: (scheduleId: number) => void;
}

export default function DatePickerBottomSheet({
  isOpen,
  onClose,
  startDate,
  endDate,
  eventTitle,
  contentId,
  onScheduleAdded,
}: DatePickerBottomSheetProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState<string>(() => {
    try {
      return dayjs(startDate).isValid()
        ? dayjs(startDate).format("YYYY-MM-DD")
        : dayjs().format("YYYY-MM-DD");
    } catch {
      return dayjs().format("YYYY-MM-DD");
    }
  });

  const bottomSheetRef = useRef<BottomSheet | null>(null);
  const insets = useSafeAreaInsets();

  // 바텀시트 열기/닫기 처리
  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.expand();
      // 바텀시트가 열릴 때마다 startDate로 리셋하고 선택된 날짜 초기화
      try {
        const validStartDate = dayjs(startDate).isValid()
          ? startDate
          : dayjs().format("YYYY-MM-DD");
        setCurrentMonth(validStartDate);
      } catch {
        setCurrentMonth(dayjs().format("YYYY-MM-DD"));
      }
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
    setCurrentMonth(month.dateString);
  }, []);

  // 커스텀 헤더에서 월 변경 처리
  const handleHeaderMonthChange = useCallback(
    (newDate: string) => {
      setCurrentMonth(newDate);
      // Calendar 컴포넌트에게 월 변경을 알리기 위해 onMonthChange 호출
      handleMonthChange({ dateString: newDate } as DateData);
    },
    [handleMonthChange],
  );

  const handleAddMySchedule = useCallback(async () => {
    if (selectedDate) {
      try {
        const response = await authApi.post(
          `${BACKEND_URL}/contents/${contentId}/my-schedules`,
          {
            date: selectedDate,
          },
        );

        if (response.data.isSuccess) {
          const scheduleId = response.data.result.scheduleId;
          // 성공 콜백 호출
          if (onScheduleAdded) {
            onScheduleAdded(scheduleId);
          }
          onClose();
          Alert.alert("일정에 추가되었습니다.", "내 일정에서 확인해주세요.");
        } else {
          throw new Error("일정 생성에 실패했습니다.");
        }
      } catch (error) {
        console.error("API 요청 오류:", error);
        Alert.alert("오류", "일정 생성에 실패했습니다. 다시 시도해주세요.");
      }
    }
  }, [selectedDate, onClose, contentId, onScheduleAdded]);

  // 커스텀 헤더 렌더링
  const renderHeader = useCallback(() => {
    return (
      <CalendarHeader
        selectedDate={currentMonth}
        setSelectedDate={handleHeaderMonthChange}
        minDate={startDate}
        maxDate={endDate}
      />
    );
  }, [currentMonth, handleHeaderMonthChange, startDate, endDate]);

  // 마킹된 날짜들 생성
  const markedDates = useMemo(() => {
    const marked: { [key: string]: any } = {};

    try {
      // 선택 가능한 날짜 범위 설정
      const start = dayjs(startDate);
      const end = dayjs(endDate);

      if (!start.isValid() || !end.isValid()) {
        return marked;
      }

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
          marked: true,
        };
      }
    } catch (error) {
      console.error("날짜 마킹 오류:", error);
    }

    return marked;
  }, [startDate, endDate, selectedDate]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={isOpen ? 0 : -1}
      onClose={onClose}
      enablePanDownToClose
      enableDynamicSizing={true}
      backgroundStyle={{
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: -4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
      }}
      handleIndicatorStyle={{
        backgroundColor: "#D1D5DB",
        width: 40,
        height: 4,
        borderRadius: 2,
        marginTop: 8,
      }}
    >
      <BottomSheetView
        className="px-4"
        style={{
          paddingBottom: 16 + insets.bottom,
          paddingHorizontal: Platform.OS === "web" ? 10 : 0,
        }}
      >
        <Calendar
          key={currentMonth}
          theme={getCalendarTheme()}
          firstDay={0}
          monthFormat="yyyy년 MM월"
          current={currentMonth}
          minDate={startDate}
          maxDate={endDate}
          markedDates={markedDates}
          onDayPress={handleDayPress}
          onMonthChange={handleMonthChange}
          disableAllTouchEventsForDisabledDays
          hideExtraDays
          hideArrows={true}
          renderHeader={renderHeader}
          disableMonthChange={false}
          enableSwipeMonths={false}
          dayComponent={CustomDay}
        />

        {selectedDate && (
          <View className="px-4 py-2">
            <Text className="text-base font-medium text-gray-700">
              선택한 날: {dayjs(selectedDate).format("MM월 DD일 (ddd)")}
            </Text>
          </View>
        )}

        <View className="p-4">
          <Pressable
            className={`flex-1 rounded-lg py-4 ${
              selectedDate ? "bg-[#6C4DFF]" : "bg-[#BDBDBD]"
            }`}
            onPress={handleAddMySchedule}
            disabled={!selectedDate}
            style={({ pressed }) => [
              { opacity: pressed && selectedDate ? 0.8 : 1 },
            ]}
          >
            <Text className="text-center text-base font-medium text-white">
              내 일정에 추가하기
            </Text>
          </Pressable>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}
