import { useState } from "react";

import { Pressable, Text, View } from "react-native";

export default function LikeFilter() {
  const filterList = ["전체", "공연", "전시", "축제", "행사"];
  const [selected, setSelected] = useState("전체");
  return (
    <View className="flex flex-row gap-2">
      {filterList.map((item) => {
        return (
          <Pressable
            onPress={() => setSelected(item)}
            key={item}
            className={`flex h-[33px] w-[49px] items-center justify-center rounded-[20px] text-[14px] ${
              selected === item
                ? "bg-[#816BFF] text-white"
                : "border-[1px] border-[#816BFF] bg-white"
            } `}
          >
            <Text
              className={`${
                selected === item ? "text-white" : "text-[#816BFF]"
              }`}
            >
              {item}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
