import React from "react";

import dayjs from "dayjs";
import { Image, Pressable, Text, View } from "react-native";

import { ScheduleItemType } from "@/constants/ScheduleData";

interface ScheduleItemProps {
  item: ScheduleItemType;
  onPress?: (contentId: number) => void;
}

const formatDateRange = (startDate: string, endDate: string) => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  if (start.year() === end.year()) {
    return `${start.format("YYYY.MM.DD")} - ${end.format("MM.DD")}`;
  } else {
    return `${start.format("YYYY.MM.DD")} - ${end.format("YYYY.MM.DD")}`;
  }
};

export default function ScheduleItem({ item, onPress }: ScheduleItemProps) {
  return (
    <Pressable
      onPress={() => onPress?.(item.contentId)}
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
    >
      <View className="flex-row gap-x-[18px]">
        <Image
          source={require("../../assets/images/content_placeholder.png")}
          className="h-[136px] w-[104px] rounded-lg"
          resizeMode="cover"
        />
        <View className="flex-1 py-2.5">
          <Text className="mb-1 text-base font-semibold text-[#212121]">
            {item.title}
          </Text>
          <Text className="mb-0.5 text-[13px] font-normal text-[#9E9E9E]">
            {item.address}
          </Text>
          <Text className="text-[13px] font-normal text-[#424242]">
            {formatDateRange(item.startDate, item.endDate)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
