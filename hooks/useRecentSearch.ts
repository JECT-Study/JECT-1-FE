import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { SearchRecentUrl } from "@/constants/ApiUrls";

export default function useRecentSearch() {
  // TODO : 최근 검색어 가져오는 기능 구현 필요.
  const [recentSearchData, setRecentSearchData] = useState<string[]>([
    "6월 축제",
    "푸드 페스티벌",
    "고창 축제",
    "7월 축제",
    "8월 축제",
    "9월 축제",
  ]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(SearchRecentUrl);
        // setRecentSearchData(response.result);
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error(axiosError);
      }
    };
    // fetchData();
  }, []);

  // TODO : 삭제하는 경우 서버에 api 요청을 보내야함.
  const handleDelete = async (keyword: string) => {
    await axios.delete(`${SearchRecentUrl}/${keyword}`);
    setRecentSearchData((prev) => prev.filter((item) => item !== keyword));
  };
  const handleDeleteAll = () => {
    setRecentSearchData([]);
    // TODO : 전체 삭제 관련 api가 없음. 설계되어야함.
  };

  return {
    handleDelete,
    handleDeleteAll,
    recentSearchData,
  };
}
