export interface ScheduleItemType {
  id: number;
  title: string;
  time: string;
}

export interface ScheduleByDate {
  title: string;
  data: ScheduleItemType[];
}

export type ScheduleData = ScheduleByDate[];

// 날짜별 일정 더미 데이터
export const initialScheduleData: ScheduleData = [
  {
    title: "2025-07-02",
    data: [
      { id: 1, title: "팀 미팅", time: "09:00" },
      { id: 2, title: "프로젝트 검토", time: "14:00" },
      { id: 3, title: "개발 계획 논의", time: "16:30" },
    ],
  },
  {
    title: "2025-07-03",
    data: [
      { id: 4, title: "프로젝트 발표", time: "10:00" },
      { id: 5, title: "고객 미팅", time: "15:00" },
    ],
  },
  {
    title: "2025-07-06",
    data: [{ id: 6, title: "클라이언트 미팅", time: "10:30" }],
  },
  {
    title: "2025-07-07",
    data: [
      { id: 7, title: "코드 리뷰", time: "09:00" },
      { id: 8, title: "디자인 검토", time: "11:00" },
      { id: 9, title: "스프린트 계획", time: "15:00" },
    ],
  },
  {
    title: "2025-07-08",
    data: [
      { id: 10, title: "스프린트 시작", time: "09:30" },
      { id: 11, title: "기술 스터디", time: "18:00" },
    ],
  },
  {
    title: "2025-07-10",
    data: [
      { id: 12, title: "디자인 검토", time: "13:00" },
      { id: 13, title: "UI/UX 피드백", time: "15:30" },
      { id: 14, title: "개발팀 회의", time: "17:00" },
    ],
  },
  {
    title: "2025-07-12",
    data: [{ id: 15, title: "개발자 컨퍼런스", time: "11:00" }],
  },
  {
    title: "2025-07-14",
    data: [
      { id: 16, title: "고객 피드백 세션", time: "14:00" },
      { id: 17, title: "서비스 개선 회의", time: "16:00" },
    ],
  },
  {
    title: "2025-07-15",
    data: [
      { id: 18, title: "분기 리뷰", time: "10:00" },
      { id: 19, title: "성과 발표", time: "13:00" },
      { id: 20, title: "팀 회식", time: "18:30" },
    ],
  },
  {
    title: "2025-07-17",
    data: [
      { id: 21, title: "신규 기능 기획", time: "09:00" },
      { id: 22, title: "기술 검토", time: "14:30" },
    ],
  },
  {
    title: "2025-07-19",
    data: [
      { id: 23, title: "QA 테스트", time: "09:00" },
      { id: 24, title: "버그 픽스", time: "13:00" },
      { id: 25, title: "배포 준비", time: "16:00" },
    ],
  },
  {
    title: "2025-07-21",
    data: [{ id: 26, title: "데모 데이", time: "15:30" }],
  },
  {
    title: "2025-07-23",
    data: [
      { id: 27, title: "브레인스토밍", time: "11:30" },
      { id: 28, title: "아이디어 정리", time: "14:00" },
    ],
  },
  {
    title: "2025-07-25",
    data: [
      { id: 29, title: "1:1 미팅", time: "10:00" },
      { id: 30, title: "개인 면담", time: "13:30" },
      { id: 31, title: "성과 평가", time: "15:00" },
    ],
  },
  {
    title: "2025-07-28",
    data: [
      { id: 32, title: "워크샵", time: "10:00" },
      { id: 33, title: "팀 빌딩", time: "14:00" },
    ],
  },
  {
    title: "2025-07-30",
    data: [
      { id: 34, title: "월말 정리", time: "09:00" },
      { id: 35, title: "다음 달 계획", time: "11:00" },
      { id: 36, title: "팀 회의", time: "16:30" },
    ],
  },
];
