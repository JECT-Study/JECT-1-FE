/**
 * 최소 로딩 시간을 보장하는 함수
 * @param startTime 로딩 시작 시간 (Date.now())
 * @param minDuration 최소 로딩 시간 (기본값: 300ms)
 */
export const ensureMinLoadingTime = async (
  startTime: number,
  minDuration: number = 300,
): Promise<void> => {
  const elapsedTime = Date.now() - startTime; // 경과 시간 계산
  const remainingTime = Math.max(0, minDuration - elapsedTime); // 남은 시간 계산

  if (remainingTime > 0) {
    await new Promise((resolve) => setTimeout(resolve, remainingTime));
  }
};
