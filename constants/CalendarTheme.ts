import { Platform } from "react-native";

const primaryColor = "#6B51FB";
const backgroundColor = "#ffffff";
const disabledColor = "#d9e1e8";

export const getCalendarTheme = () => {
  return {
    // 전체 캘린더 배경
    backgroundColor: backgroundColor,
    calendarBackground: backgroundColor,

    // 화살표 (월 이동)
    arrowColor: primaryColor,
    arrowStyle: { padding: 0 },

    // 월 제목 (2024년 1월)
    monthTextColor: "#2d4150",
    textMonthFontSize: 16,
    textMonthFontFamily: "System",
    textMonthFontWeight: "bold" as const,

    // 요일 헤더 (일, 월, 화, 수, 목, 금, 토)
    textSectionTitleColor: "#8F8F8F",
    textDayHeaderFontSize: 11,
    textDayHeaderFontFamily: "System",
    textDayHeaderFontWeight: 500 as const,

    // 날짜 숫자들
    dayTextColor: "#111111",
    todayTextColor: primaryColor,
    textDayFontSize: 14,
    textDayFontFamily: "System",
    textDayFontWeight: 500 as const,
    textDayStyle: { marginTop: Platform.OS === "android" ? 2 : 4 },

    // 선택된 날짜
    selectedDayBackgroundColor: primaryColor,
    selectedDayTextColor: "#ffffff",

    // 비활성화된 날짜 (이전/다음 달)
    textDisabledColor: disabledColor,

    // 점 (일정 마킹)
    dotColor: primaryColor,
    selectedDotColor: "#ffffff",
    disabledDotColor: disabledColor,
    dotStyle: { marginTop: 2 },

    // 로딩 인디케이터
    indicatorColor: primaryColor,
  };
};

export { primaryColor, backgroundColor };
