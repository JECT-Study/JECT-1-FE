import { router } from "expo-router";
import { SafeAreaView, View } from "react-native";

import LikeFilter from "@/components/mypage/LikeFilter";
import CustomHeader from "@/components/ui/CustomHeader";

export default function Like() {
  return (
    <SafeAreaView className="w-full flex-1 items-center bg-white">
      <CustomHeader
        title="관심 목록"
        isCommit={false}
        cancel={() => {
          router.replace("/my");
        }}
      />
      <View className="flex w-full items-start p-6">
        <LikeFilter />
      </View>
    </SafeAreaView>
  );
}
