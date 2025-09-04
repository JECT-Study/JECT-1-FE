import { useCallback, useState } from "react";

export default function useLikeRefresh(refetchFunction?: () => Promise<void>) {
  const [refresh, setRefresh] = useState(false);

  const onRefresh = useCallback(async () => {
    if (!refetchFunction) return;

    setRefresh(true);
    try {
      await refetchFunction();
    } catch (error) {
      console.error("새로고침 실패:", error);
    } finally {
      setRefresh(false);
    }
  }, [refetchFunction]);

  return {
    refresh,
    onRefresh,
  };
}
