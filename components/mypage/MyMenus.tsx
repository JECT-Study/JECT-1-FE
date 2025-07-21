import { Pressable, Text, View } from "react-native";

import CalendarEditIcon from "@/components/icons/CalendarEditIcon";
import DiaryIcon from "@/components/icons/DiaryIcon";
import HeartIcon from "@/components/icons/HeartIcon";
import usePageNavigation from "@/hooks/usePageNavigation";

export default function MyMenus() {
  const { goLike, goPlan } = usePageNavigation();
  return (
    <View className="mx-6 my-4 flex flex-row items-center justify-center rounded-md bg-[#F2F3F6]">
      <Pressable
        onPress={() => goPlan()}
        className="m-2 flex h-[70px] w-[105px] items-center justify-center"
      >
        <DiaryIcon />
        <Text className="m-[3.25px] text-[13px]">나의일정</Text>
      </Pressable>
      <View aria-label="seperator" className="h-[20px] w-[1px] bg-[#DDDFE6]" />
      <Pressable
        onPress={() => goLike()}
        className="m-2 flex h-[70px] w-[105px] items-center justify-center"
      >
        <HeartIcon size={24} />
        <Text className="m-[3.25px] text-[13px]">관심목록</Text>
      </Pressable>
      <View aria-label="seperator" className="h-[20px] w-[1px] bg-[#DDDFE6]" />
      <Pressable
        onPress={() => console.log("Pressable")}
        className="m-2 flex h-[70px] w-[105px] items-center justify-center"
      >
        <CalendarEditIcon />
        <Text className="m-[3.25px] text-[13px]">취향 분석하기</Text>
      </Pressable>
    </View>
  );
}
