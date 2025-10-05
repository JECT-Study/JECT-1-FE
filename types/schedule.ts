// 스케줄 관련 타입 정의

import { ScheduleItemType } from "@/constants/ScheduleData";

export interface ScheduleApiSort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface ScheduleApiPageable {
  offset: number;
  sort: ScheduleApiSort;
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  unpaged: boolean;
}

export interface ScheduleApiResult {
  totalPages: number;
  totalElements: number;
  size: number;
  content: ScheduleItemType[];
  number: number;
  sort: ScheduleApiSort;
  numberOfElements: number;
  pageable: ScheduleApiPageable;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface ScheduleApiResponse {
  isSuccess: boolean;
  code: number;
  message: string;
  result: ScheduleApiResult;
}
