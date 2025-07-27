import { SafeAreaView, Text } from "react-native";
import CustomHeader from "@/components/ui/CustomHeader";
import { router } from "expo-router";

export default function SearchScreen() {
  return (
    <SafeAreaView className="w-full flex-1 bg-white">
      <CustomHeader
        title="검색"
        isCommit={false}
        cancel={() => router.back()}
      />
    </SafeAreaView>
  );
}
