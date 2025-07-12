import { useCallback, useState } from "react";

export default function useLikeRefresh() {
  const [refresh, setRefresh] = useState(false);
  const onRefresh = useCallback(() => {
    setRefresh(true);
    // TODO : 실제 과정에선 API 요청하고 응답하는 시간을 고려한 로직 재설정 필요
    setTimeout(() => {
      console.log("데이터 새로고침");
      setRefresh(false);
    }, 2000);
  }, []);
  return {
    refresh,
    onRefresh,
  };
}
