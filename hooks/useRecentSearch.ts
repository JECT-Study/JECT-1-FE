import { useState } from "react";

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
  // TODO : 삭제하는 경우 서버에 api 요청을 보내야함.
  const handleDelete = (keyword: string) => {
    setRecentSearchData((prev) => prev.filter((item) => item !== keyword));
  };
  const handleDeleteAll = () => {
    setRecentSearchData([]);
  };

  return {
    handleDelete,
    handleDeleteAll,
    recentSearchData,
  };
}
