// TODO : GPT로 만든 더미데이터, 나중에 실 데이터로 바꾸고 삭제 필요.

// 1. 새로운 데이터 구조에 맞는 인터페이스를 정의합니다.
export type Category = "festival" | "concert" | "exhibition" | "event";

export interface EventPost {
  id: number;
  img_url: string;
  title: string;
  address: string;
  category: Category;
  start_date: string;
  end_date: string;
}

// 2. 지정된 카테고리 배열을 만듭니다.
const CATEGORIES: Category[] = ["festival", "concert", "exhibition", "event"];

// 3. 날짜를 포맷하는 간단한 유틸리티 함수입니다. (YYYY.MM.DD)
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}.${month}.${day}`;
};

// 4. 100개의 더미 데이터를 생성합니다.
export const DUMMY_EVENT_POSTS: EventPost[] = Array.from(
  { length: 100 },
  (_, i) => {
    const id = i + 1;
    const category = CATEGORIES[i % CATEGORIES.length]; // 카테고리를 순환하며 지정

    // 랜덤한 시작일과 종료일 생성
    const startDate = new Date(
      Date.now() + (Math.random() - 0.5) * 1000 * 60 * 60 * 24 * 60, // 2달 범위 내 랜덤 시작일
    );
    const endDate = new Date(
      startDate.getTime() + Math.random() * 1000 * 60 * 60 * 24 * 14, // 시작일로부터 2주 내 랜덤 종료일
    );

    return {
      id,
      img_url: `https://picsum.photos/seed/${id}/400/300`, // 고유 ID로 일관된 이미지 생성
      title: `${category.charAt(0).toUpperCase() + category.slice(1)} #${id}: JECT 피자챗`,
      address: `서울특별시 ${id}`,
      category,
      start_date: formatDate(startDate),
      end_date: formatDate(endDate),
    };
  },
);
