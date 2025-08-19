import { useEffect, useState } from "react";

import dayjs from "dayjs";

import { UsersScheduleCheckUrl, UsersSchedulesUrl } from "@/constants/ApiUrls";
import { authApi } from "@/features/axios/axiosInstance";

export type ScheduleItem = {
  contentId: number;
  title: string;
  image: string | null;
  address: string;
  startDate: string;
  endDate: string;
};

export const usePlan = () => {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [scheduleDates, setScheduleDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(
    dayjs().format("YYYY-MM-DD"),
  );

  const fetchScheduleDates = async (month: string) => {
    try {
      const response = await authApi.get(UsersScheduleCheckUrl, {
        params: { month },
      });
      setScheduleDates(response.data.result);
    } catch {
      // const axiosError = error as AxiosError;
      // console.log("Error fetching schedule dates:", axiosError);
    }
  };

  const fetchSchedulesByDate = async (
    day: string,
    pageNumber: number = 0,
    isLoadMore: boolean = false,
  ) => {
    setLoading(true);
    try {
      const response = await authApi.get(UsersSchedulesUrl, {
        params: {
          page: pageNumber,
          limit: 10,
          day,
        },
      });

      const { content, last } = response.data.result;

      if (isLoadMore) {
        setSchedules((prev) => [...prev, ...content]);
        setPage(pageNumber);
      } else {
        setSchedules(content);
        setPage(0);
      }

      setHasMore(!last);
    } catch {
      // const axiosError = error as AxiosError;
      // console.log("Error fetching schedules:", axiosError);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (loading || !hasMore) return;
    await fetchSchedulesByDate(selectedDate, page + 1, true);
  };

  const handleDateChange = (dateString: string) => {
    setSelectedDate(dateString);

    // 해당 날짜에 일정이 있는 경우에만 API 호출
    if (scheduleDates.includes(dateString)) {
      fetchSchedulesByDate(dateString);
    } else {
      // 일정이 없으면 빈 배열로 설정
      setSchedules([]);
      setPage(0);
      setHasMore(false);
    }
  };

  const handleMonthChange = (month: string) => {
    fetchScheduleDates(month);
  };

  useEffect(() => {
    const currentMonth = dayjs().format("YYYY-MM");
    fetchScheduleDates(currentMonth);
  }, []);

  return {
    schedules,
    scheduleDates,
    loading,
    hasMore,
    selectedDate,
    loadMore,
    handleDateChange,
    handleMonthChange,
    refetch: () => fetchSchedulesByDate(selectedDate),
  };
};
