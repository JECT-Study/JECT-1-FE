import { View, Text, ScrollView, Pressable } from "react-native";

type FilterSectionProps<T extends string> = {
  title: string;
  options: T[];
  selected: T | "";
  onChange: (value: T | "") => void;
  mappingObject: Record<T, string>;
};

export default function FilterSection<T extends string>({
  title,
  options,
  selected,
  onChange,
  mappingObject,
}: FilterSectionProps<T>) {
  const toggleOption = (option: T) => {
    onChange(option);
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
            selected === "" ? "bg-main" : "bg-gray-200"
          }`}
          onPress={() => onChange("")}
        >
          <Text
            className={`text-[14px] ${
              selected === "" ? "text-white" : "text-gray600"
            }`}
          >
            전체
          </Text>
        </Pressable>

        {options.map((option) => {
          const isSelected = selected === option;
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
                {mappingObject[option]}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
