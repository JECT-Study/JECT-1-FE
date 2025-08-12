const primaryColor = "#6C4DFF";
const backgroundColor = "#ffffff";

export const getCalendarTheme = () => {
  return {
    // 전체 캘린더 배경
    backgroundColor: backgroundColor,
    calendarBackground: backgroundColor,

    // 요일 헤더 (일, 월, 화, 수, 목, 금, 토)
    textSectionTitleColor: "#8F8F8F",
    textDayHeaderFontSize: 14,
    textDayHeaderFontFamily: "System",
    textDayHeaderFontWeight: 400 as const,

    // 로딩 인디케이터
    indicatorColor: primaryColor,
  };
};
