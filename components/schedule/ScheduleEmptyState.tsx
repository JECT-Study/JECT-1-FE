import React from "react";

import { View, Text } from "react-native";

export default function ScheduleEmptyState() {
  return (
    <View className="items-center justify-center gap-y-1">
      <Text className="text-lg font-medium text-[#424242]">
        예정된 일정이 없어요.
      </Text>
      <Text className="text-base font-normal text-[#9E9E9E]">
        다른 날을 조회해보세요!
      </Text>
    </View>
  );
}
