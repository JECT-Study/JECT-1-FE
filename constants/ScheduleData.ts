export interface ScheduleItemType {
  id: number;
  title: string;
  time: string;
  startDate: string;
  endDate: string;
}

// 더미 데이터
export const initialScheduleData: ScheduleItemType[] = [
  {
    id: 1,
    title: "여름 워크샵",
    time: "09:00",
    startDate: "2025-07-08",
    endDate: "2025-07-10",
  },
  {
    id: 2,
    title: "프로젝트 스프린트",
    time: "14:00",
    startDate: "2025-07-08",
    endDate: "2025-07-15",
  },
  {
    id: 3,
    title: "개발 교육",
    time: "16:30",
    startDate: "2025-07-09",
    endDate: "2025-07-09",
  },
  {
    id: 4,
    title: "클라이언트 미팅",
    time: "10:30",
    startDate: "2025-07-10",
    endDate: "2025-07-10",
  },
  {
    id: 5,
    title: "디자인 검토",
    time: "11:00",
    startDate: "2025-07-11",
    endDate: "2025-07-12",
  },
  {
    id: 6,
    title: "개발자 컨퍼런스",
    time: "11:00",
    startDate: "2025-07-12",
    endDate: "2025-07-12",
  },
  {
    id: 7,
    title: "고객 피드백 세션",
    time: "14:00",
    startDate: "2025-07-14",
    endDate: "2025-07-14",
  },
  {
    id: 8,
    title: "분기 리뷰",
    time: "10:00",
    startDate: "2025-07-15",
    endDate: "2025-07-15",
  },
  {
    id: 9,
    title: "팀 회식",
    time: "18:30",
    startDate: "2025-07-15",
    endDate: "2025-07-15",
  },
  {
    id: 10,
    title: "QA 테스트 주간",
    time: "09:00",
    startDate: "2025-07-16",
    endDate: "2025-07-20",
  },
  {
    id: 11,
    title: "기술 검토",
    time: "14:30",
    startDate: "2025-07-17",
    endDate: "2025-07-17",
  },
  {
    id: 12,
    title: "개발 세미나",
    time: "13:00",
    startDate: "2025-07-18",
    endDate: "2025-07-19",
  },
  {
    id: 13,
    title: "배포 준비",
    time: "16:00",
    startDate: "2025-07-19",
    endDate: "2025-07-19",
  },
  {
    id: 14,
    title: "데모 데이",
    time: "15:30",
    startDate: "2025-07-21",
    endDate: "2025-07-21",
  },
  {
    id: 15,
    title: "해외 출장",
    time: "08:00",
    startDate: "2025-07-22",
    endDate: "2025-07-25",
  },
  {
    id: 16,
    title: "아이디어 정리",
    time: "14:00",
    startDate: "2025-07-23",
    endDate: "2025-07-23",
  },
  {
    id: 17,
    title: "성과 평가",
    time: "15:00",
    startDate: "2025-07-25",
    endDate: "2025-07-25",
  },
  {
    id: 18,
    title: "여름 휴가",
    time: "전일",
    startDate: "2025-07-26",
    endDate: "2025-07-28",
  },
  {
    id: 19,
    title: "프로젝트 마무리",
    time: "09:00",
    startDate: "2025-07-29",
    endDate: "2025-07-30",
  },
  {
    id: 20,
    title: "월말 정리",
    time: "11:00",
    startDate: "2025-07-30",
    endDate: "2025-07-30",
  },
  {
    id: 21,
    title: "팀 회의",
    time: "16:30",
    startDate: "2025-07-30",
    endDate: "2025-07-30",
  },
];
