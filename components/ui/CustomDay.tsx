import dayjs from "dayjs";
import { Pressable, Text, View } from "react-native";
import { DateData } from "react-native-calendars";

interface DayProps {
  date?: DateData;
  state?: "selected" | "disabled" | "today" | "inactive" | "";
  marking?: {
    marked?: boolean;
    dotColor?: string;
    selected?: boolean;
    selectedColor?: string;
    selectedTextColor?: string;
  };
  onPress?: (date: DateData) => void;
}

// 커스텀 Day 컴포넌트 (일요일을 빨간색으로 표시)
export const CustomDay = ({ date, state, marking, onPress }: DayProps) => {
  const dateObj = dayjs(date?.dateString);
  const isSunday = dateObj.day() === 0;

  // state 또는 marking에서 선택 상태 확인
  const isSelected = state === "selected" || marking?.selected;
  const isDisabled = state === "disabled";

  // 선택된 날짜의 배경색 결정
  const selectedBgColor = marking?.selectedColor || "#6C4DFF";
  const selectedTextColor = marking?.selectedTextColor || "#F9F9F9";

  let textColor = "#424242"; // 기본 색상
  if (isDisabled) {
    textColor = "#9E9E9E"; // 비활성화된 날짜
  } else if (isSelected) {
    textColor = selectedTextColor; // 선택된 날짜
  } else if (isSunday) {
    textColor = "#F43630"; // 일요일
  }

  return (
    <Pressable
      onPress={() => onPress?.(date!)}
      className="m-[-2px] h-10 w-10 items-center justify-center rounded-full"
      style={{
        backgroundColor: isSelected ? selectedBgColor : "transparent",
      }}
    >
      <Text
        className="text-lg font-medium"
        style={{
          color: textColor,
        }}
      >
        {date?.day}
      </Text>
      {marking?.marked && (
        <View
          className="absolute bottom-1 h-1 w-1 rounded-full"
          style={{ backgroundColor: marking.dotColor || "#6C4DFF" }}
        />
      )}
    </Pressable>
  );
};
