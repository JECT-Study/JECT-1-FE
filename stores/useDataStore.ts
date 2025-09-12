import { create } from "zustand";

// 홈탭 데이터 타입들 (기존 탭에서 가져옴)
export interface CustomContentItem {
  contentId: number;
  title: string;
  image: string;
  contentType: string;
  address: string;
  longitude: number;
  latitude: number;
  startDate: string;
  endDate: string;
}

export interface WeeklyContentItem {
  contentId: number;
  title: string;
  image: string | null;
  address: string;
  startDate: string;
  endDate: string;
}

export interface CategoryContentItem {
  contentId: number;
  title: string;
  image: string | null;
  longitude: number;
  latitude: number;
  startDate: string;
  endDate: string;
}

// 스케줄 데이터 타입 (기존 constants와 일치)
export interface ScheduleItemType {
  contentId: number;
  title: string;
  image: string;
  address: string;
  startDate: string;
  endDate: string;
}

// 사용자 정보 타입
export interface UserInfo {
  isLoggedIn: boolean;
  nickname: string;
  profileImage: string;
}

interface DataStore {
  // 로딩 상태
  isLoading: boolean;
  allDataLoaded: boolean;

  // 전역 날짜 정보
  currentDate: string; // YYYY-MM-DD 형식의 오늘 날짜

  // 홈탭 데이터
  homeData: {
    recommendations: CustomContentItem[];
    hotFestival: CustomContentItem[];
    weeklyContent: WeeklyContentItem[];
    categoryContent: CategoryContentItem[];
  };

  // 스케줄 데이터
  scheduleData: ScheduleItemType[];

  // 사용자 정보
  userInfo: UserInfo;

  // Actions
  setLoading: (loading: boolean) => void;
  setAllDataLoaded: (loaded: boolean) => void;
  setCurrentDate: (date: string) => void;
  setHomeData: (data: Partial<DataStore["homeData"]>) => void;
  setScheduleData: (data: ScheduleItemType[]) => void;
  setUserInfo: (info: UserInfo) => void;
  resetData: () => void;
}

const initialState = {
  isLoading: false,
  allDataLoaded: false,
  currentDate: "", // 초기화 시 빈 문자열로 설정
  homeData: {
    recommendations: [],
    hotFestival: [],
    weeklyContent: [],
    categoryContent: [],
  },
  scheduleData: [],
  userInfo: {
    isLoggedIn: false,
    nickname: "",
    profileImage: "",
  },
};

const useDataStore = create<DataStore>((set) => ({
  ...initialState,

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setAllDataLoaded: (loaded: boolean) => {
    set({ allDataLoaded: loaded });
  },

  setCurrentDate: (date: string) => {
    set({ currentDate: date });
  },

  setHomeData: (data: Partial<DataStore["homeData"]>) => {
    set((state) => ({
      homeData: { ...state.homeData, ...data },
    }));
  },

  setScheduleData: (data: ScheduleItemType[]) => {
    set({ scheduleData: data });
  },

  setUserInfo: (info: UserInfo) => {
    set({ userInfo: info });
  },

  resetData: () => {
    set(initialState);
  },
}));

export default useDataStore;
