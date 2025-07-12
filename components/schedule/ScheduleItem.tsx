import React from "react";

import { View, Text } from "react-native";

import { ScheduleItemType } from "@/constants/ScheduleData";

interface ScheduleItemProps {
  item: ScheduleItemType;
  primaryColor: string;
}

export default function ScheduleItem({
  item,
  primaryColor,
}: ScheduleItemProps) {
  return (
    <View className="mx-5 mb-3 rounded-lg border border-gray-100 bg-white p-4">
      <View className="flex-row items-center">
        <View
          className="mr-3 h-3 w-3 rounded-full"
          style={{ backgroundColor: primaryColor }}
        />
        <View className="flex-1">
          <Text className="text-base font-medium text-gray-900">
            {item.title}
          </Text>
          <Text className="mt-1 text-sm text-gray-500">{item.time}</Text>
        </View>
      </View>
    </View>
  );
}
