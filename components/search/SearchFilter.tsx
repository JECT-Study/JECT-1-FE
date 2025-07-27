// components/FilterSection.tsx
import { View, Text, ScrollView, Pressable } from "react-native";

type Props = {
  title: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
};

export default function FilterSection({
  title,
  options,
  selected,
  onChange,
}: Props) {
  const toggleOption = (option: string) => {
    onChange(
      selected.includes(option)
        ? selected.filter((item) => item !== option)
        : [...selected, option],
    );
  };

  return (
    <View aria-label={`${title} 선택`} className="mt-4">
      <Text className="my-3 px-[18px] text-[16px] font-medium">{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        className="flex flex-row"
      >
        <Pressable
          className={`mr-2 flex h-8 items-center justify-center rounded-[20px] px-3 ${
            selected.length === 0 ? "bg-main" : "bg-gray-200"
          }`}
          onPress={() => onChange([])}
        >
          <Text
            className={`text-[14px] ${
              selected.length === 0 ? "text-white" : "text-gray600"
            }`}
          >
            전체
          </Text>
        </Pressable>

        {options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <Pressable
              key={option}
              onPress={() => toggleOption(option)}
              className={`mr-2 flex h-8 items-center justify-center rounded-[20px] px-3 ${
                isSelected ? "bg-main" : "bg-gray-200"
              }`}
            >
              <Text
                className={`text-[14px] ${
                  isSelected ? "text-white" : "text-gray600"
                }`}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
