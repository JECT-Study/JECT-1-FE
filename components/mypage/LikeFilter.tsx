import { Pressable, Text, View } from "react-native";

import { categoryUnion, filterData } from "@/constants/Filter";
import {
  useCategorySelected,
  useSetCategorySelect,
} from "@/stores/useCategoryStore";

export default function LikeFilter() {
  const selected = useCategorySelected();
  const setSelected = useSetCategorySelect();
  return (
    <View className="flex flex-row gap-[10px]">
      {Object.entries(filterData).map(([key, value]) => {
        return (
          <Pressable
            onPress={() => {
              setSelected(key as categoryUnion);
            }}
            key={key}
            className={`flex h-[33px] w-[49px] items-center justify-center rounded-[20px] text-[14px] ${
              selected === key
                ? "bg-[#816BFF] text-white"
                : "border-[1px] border-[#816BFF] bg-white"
            } `}
          >
            <Text
              className={`${
                selected === key ? "text-white" : "text-[#816BFF]"
              }`}
            >
              {value}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
