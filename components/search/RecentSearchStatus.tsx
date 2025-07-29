import { Text, View } from "react-native";

type TypeEnum = "NO_RECENT_SEARCH" | "NO_MATCH";

export default function RecentSearchStatus({ type }: { type: TypeEnum }) {
  const main =
    type === "NO_RECENT_SEARCH"
      ? "최근 검색어가 없어요."
      : "일치하는 검색 결과가 없어요.";
  const sub =
    type === "NO_RECENT_SEARCH"
      ? "관심사를 검색해보세요!"
      : "관심사를 변경해보세요!";
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="mb-[6px] text-[18px]">{main}</Text>
      <Text className="text-[16px] text-gray500">{sub}</Text>
    </View>
  );
}
