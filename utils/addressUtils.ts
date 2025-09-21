/**
 * address를 시/도 구/군까지만 표시하는 함수
 * @param address 전체 주소 문자열
 * @returns 시/도 구/군까지만 포함된 주소 문자열
 */
export const formatAddress = (address: string): string => {
  const parts = address.split(" ");
  if (parts.length >= 2) {
    return `${parts[0]} ${parts[1]}`;
  }
  return address;
};