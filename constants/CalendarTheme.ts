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

    // 화살표 숨기기 및 헤더 레이아웃 설정 (웹 환경 호환성)
    "stylesheet.calendar.header": {
      arrow: {
        display: "none",
        opacity: 0,
        width: 0,
        height: 0,
      },
      arrowImage: {
        display: "none",
        opacity: 0,
        width: 0,
        height: 0,
      },
      monthText: {
        display: "none",
        opacity: 0,
        fontSize: 0,
      },
      header: {
        flexDirection: "row" as const,
        justifyContent: "center" as const,
        alignItems: "center" as const,
        paddingHorizontal: 10,
        paddingVertical: 6,
        width: "100%",
      },
    },

    // 캘린더 날짜 간격 조정
    "stylesheet.calendar.main": {
      container: {
        paddingLeft: 10,
        paddingRight: 10,
      },
      week: {
        marginTop: 8,
        marginBottom: 8,
        flexDirection: "row" as const,
        justifyContent: "space-around" as const,
      },
    },
  };
};
