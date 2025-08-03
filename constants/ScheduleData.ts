export interface ScheduleItemType {
  id: number;
  title: string;
  address: string;
  startDate: string;
  endDate: string;
}

// 더미 데이터
export const initialScheduleData: ScheduleItemType[] = [
  {
    id: 1,
    title: "여름 워크샵",
    address: "서울시 강남구 테헤란로 123",
    startDate: "2025-07-08",
    endDate: "2025-07-10",
  },
  {
    id: 2,
    title: "프로젝트 스프린트",
    address: "서울시 서초구 서초대로 456",
    startDate: "2025-07-08",
    endDate: "2025-07-15",
  },
  {
    id: 3,
    title: "개발 교육",
    address: "서울시 마포구 홍익로 789",
    startDate: "2025-07-09",
    endDate: "2025-07-09",
  },
  {
    id: 4,
    title: "클라이언트 미팅",
    address: "서울시 중구 을지로 101",
    startDate: "2025-07-10",
    endDate: "2025-07-10",
  },
  {
    id: 5,
    title: "디자인 검토",
    address: "서울시 용산구 한강대로 234",
    startDate: "2025-07-11",
    endDate: "2025-07-12",
  },
  {
    id: 6,
    title: "개발자 컨퍼런스",
    address: "서울시 송파구 올림픽로 567",
    startDate: "2025-07-12",
    endDate: "2025-07-12",
  },
  {
    id: 7,
    title: "고객 피드백 세션",
    address: "서울시 성동구 왕십리로 890",
    startDate: "2025-07-14",
    endDate: "2025-07-14",
  },
  {
    id: 8,
    title: "분기 리뷰",
    address: "서울시 영등포구 여의대로 321",
    startDate: "2025-07-15",
    endDate: "2025-07-15",
  },
  {
    id: 9,
    title: "팀 회식",
    address: "서울시 종로구 종로 654",
    startDate: "2025-07-15",
    endDate: "2025-07-15",
  },
  {
    id: 10,
    title: "QA 테스트 주간",
    address: "서울시 금천구 가산디지털1로 987",
    startDate: "2025-07-16",
    endDate: "2025-07-20",
  },
  {
    id: 11,
    title: "기술 검토",
    address: "서울시 구로구 디지털로 147",
    startDate: "2025-07-17",
    endDate: "2025-07-17",
  },
  {
    id: 12,
    title: "개발 세미나",
    address: "서울시 노원구 노원로 258",
    startDate: "2025-07-18",
    endDate: "2025-07-19",
  },
  {
    id: 13,
    title: "배포 준비",
    address: "서울시 동작구 상도로 369",
    startDate: "2025-07-19",
    endDate: "2025-07-19",
  },
  {
    id: 14,
    title: "데모 데이",
    address: "서울시 관악구 관악로 741",
    startDate: "2025-07-21",
    endDate: "2025-07-21",
  },
  {
    id: 15,
    title: "해외 출장",
    address: "인천시 중구 공항로 2",
    startDate: "2025-07-22",
    endDate: "2025-07-25",
  },
  {
    id: 16,
    title: "아이디어 정리",
    address: "경기도 성남시 분당구 판교로 852",
    startDate: "2025-07-23",
    endDate: "2025-07-23",
  },
  {
    id: 17,
    title: "성과 평가",
    address: "서울시 서대문구 연세로 963",
    startDate: "2025-07-25",
    endDate: "2025-07-25",
  },
  {
    id: 18,
    title: "여름 휴가",
    address: "부산시 해운대구 해운대해변로 264",
    startDate: "2025-07-26",
    endDate: "2025-07-28",
  },
  {
    id: 19,
    title: "프로젝트 마무리",
    address: "서울시 강서구 화곡로 475",
    startDate: "2025-07-29",
    endDate: "2025-07-30",
  },
  {
    id: 20,
    title: "월말 정리",
    address: "서울시 은평구 은평로 586",
    startDate: "2025-07-30",
    endDate: "2025-07-30",
  },
  {
    id: 21,
    title: "팀 회의",
    address: "서울시 도봉구 도봉로 697",
    startDate: "2025-07-30",
    endDate: "2025-07-30",
  },
];
