import React from "react";

import { View, Text } from "react-native";

export default function ScheduleEmptyState() {
  return (
    <View className="mx-4 items-center justify-center py-8">
      <Text className="text-gray-500">일정이 없습니다.</Text>
    </View>
  );
}
