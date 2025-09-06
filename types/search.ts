// 검색 관련 공통 타입 정의

// 검색 결과 인터페이스 (Search API)
export interface SearchContentItem {
  id: number;
  title: string;
  thumbnailUrl: string;
  category: string;
  address: string;
  date: string;
  views: number;
}

// 카테고리 검색 결과 인터페이스 (Category Search API)
export interface CategorySearchItem {
  id: number;
  title: string;
  category: string;
  address: string;
  thumbnailUrl: string | null;
}

// API 응답 타입
export interface CategorySearchResponse {
  isSuccess: boolean;
  code: number;
  message: string;
  result: {
    contentList: CategorySearchItem[];
    pageInfo: {
      currentPage: number;
      totalPages: number;
      totalElements: number;
    };
  };
}

// 최근 검색어 API 응답 인터페이스
export interface RecentSearchResponse {
  isSuccess: boolean;
  code: number;
  message: string;
  result: string[];
}

// 이벤트 카드 Props
export interface EventCardProps {
  item: SearchContentItem;
  onPress: (id: number) => void;
}

// 검색 상수
export const SEARCH_LIMIT = 10; // 페이지당 검색 결과 개수
