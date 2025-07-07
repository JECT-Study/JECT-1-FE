import React from "react";

import dayjs from "dayjs";
import { Text, View, TouchableOpacity } from "react-native";
import { DateData } from "react-native-calendars";

interface CustomDayComponentProps {
  date: {
    dateString: string;
    day: number;
    month: number;
    year: number;
  };
  state: "selected" | "today" | "disabled" | "";
  marking?: {
    marked?: boolean;
    dotColor?: string;
  };
  primaryColor: string;
  setSelectedDate: (dateString: string) => void;
  onDayPress?: (day: DateData) => void;
}

export default function CustomDayComponent({
  date,
  state,
  marking,
  primaryColor,
  setSelectedDate,
  onDayPress,
}: CustomDayComponentProps) {
  const dateObj = dayjs(date.dateString);
  const isSunday = dateObj.day() === 0;
  const isSelected = state === "selected";
  const isToday = state === "today";
  const isDisabled = state === "disabled";

  let textColor = "#111111"; // 기본 텍스트 색상

  if (isDisabled) {
    textColor = "#d9e1e8"; // 비활성화된 날짜
  } else if (isSelected) {
    textColor = "#ffffff"; // 선택된 날짜
  } else if (isSunday) {
    textColor = "red"; // 일요일
  }

  return (
    <TouchableOpacity
      className={`h-8 w-8 items-center justify-center ${
        isSelected ? "rounded-2xl" : ""
      } ${isToday && !isSelected ? "rounded-2xl bg-transparent" : ""}`}
      style={[
        isSelected && {
          backgroundColor: primaryColor,
        },
      ]}
      onPress={() => {
        if (!isDisabled) {
          setSelectedDate(date.dateString);
          onDayPress?.({
            dateString: date.dateString,
            day: date.day,
            month: date.month,
            year: date.year,
            timestamp: dateObj.valueOf(),
          });
        }
      }}
      disabled={isDisabled}
    >
      <Text
        className="text-center text-sm font-medium"
        style={{
          color: textColor,
        }}
      >
        {date.day}
      </Text>
      {marking?.marked && (
        <View
          className="absolute bottom-0 h-1 w-1 rounded-full"
          style={{
            backgroundColor: primaryColor,
          }}
        />
      )}
    </TouchableOpacity>
  );
}
