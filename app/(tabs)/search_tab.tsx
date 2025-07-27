import { router } from "expo-router";
import { SafeAreaView } from "react-native";

import SearchResult from "@/components/search/SearchResult";
import CustomHeader from "@/components/ui/CustomHeader";

export default function SearchScreen() {
  return (
    <SafeAreaView className="w-full flex-1 bg-white">
      <CustomHeader
        title="검색"
        isCommit={false}
        cancel={() => router.back()}
      />
      <SearchResult></SearchResult>
    </SafeAreaView>
  );
}
