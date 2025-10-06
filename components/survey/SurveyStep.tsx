import { useEffect, useState } from "react";

import { useNavigation } from "expo-router";
import { Pressable, Text, View } from "react-native";

import Chevron from "@/components/icons/Chevron";

const chunk = <T,>(array: T[], size: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

export default function SurveyStep({
  question,
  options,
  onNext,
  onBack,
  total,
  currentStep,
  dividedOptions,
  selectedValue,
  multipleSelect,
}: {
  question: string;
  options: string[];
  dividedOptions?: boolean;
  onNext: (answerIndex: number | number[]) => void;
  onBack: () => void;
  total: number;
  currentStep: number;
  selectedValue?: number | number[];
  multipleSelect?: boolean;
}) {
  const [selected, setSelected] = useState<number | number[] | null>(
    selectedValue ?? null,
  );

  const navigation = useNavigation();

  const optionRows = dividedOptions ? chunk(options, 2) : [];

  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
      swipeEnabled: false,
    });
  }, [navigation]);

  // selectedValue가 변경되면 selected 상태도 업데이트
  useEffect(() => {
    setSelected(selectedValue ?? null);
  }, [selectedValue]);

  const handleSelect = (index: number) => {
    if (multipleSelect) {
      const currentSelected = Array.isArray(selected) ? selected : [];
      if (currentSelected.includes(index)) {
        setSelected(currentSelected.filter((i) => i !== index));
      } else {
        setSelected([...currentSelected, index]);
      }
    } else {
      setSelected(index);
    }
  };

  const isSelected = (index: number) => {
    if (multipleSelect && Array.isArray(selected)) {
      return selected.includes(index);
    }
    return selected === index;
  };

  const isNextDisabled =
    selected === null ||
    (multipleSelect && Array.isArray(selected) && selected.length === 0);

  return (
    <View className="w-full flex-1 justify-between bg-white">
      <View className="h-[60px] flex-row items-center px-4">
        <Pressable onPress={onBack}>
          <Chevron direction="left" />
        </Pressable>
        <View className="flex-1 flex-row justify-center">
          {Array.from({ length: total }).map((_, i) => (
            <View
              key={i}
              className={`mx-[3px] h-1.5 w-8 rounded-[3px] ${i < currentStep ? "bg-[#816BFF]" : "bg-[#DFE2E9]"}`}
            />
          ))}
        </View>
        <View className="w-7" />
      </View>
      <View className="flex items-center">
        <Text className="mb-6 mt-4 text-center text-2xl font-semibold text-gray-800">
          {question}
        </Text>
      </View>
      {/* 선택지 */}
      <View className="flex-1 px-4">
        <View className="flex-1 gap-[10px]">
          {dividedOptions
            ? optionRows.map((row, rowIndex) => (
                <View key={rowIndex} className="flex-row gap-[10px]">
                  {row.map((label, index) => {
                    const globalIndex = rowIndex * 2 + index;
                    return (
                      <Pressable
                        key={globalIndex}
                        onPress={() => handleSelect(globalIndex)}
                        className={`h-[58px] flex-1 items-center justify-center rounded-lg p-[10px] ${
                          isSelected(globalIndex)
                            ? "border-[1.5px] border-main bg-sub"
                            : "bg-gray-100"
                        }`}
                      >
                        <Text
                          className={`text-center text-lg ${
                            isSelected(globalIndex)
                              ? "font-semibold text-main"
                              : "text-gray-600"
                          }`}
                        >
                          {label}
                        </Text>
                      </Pressable>
                    );
                  })}
                  {row.length === 1 && (
                    <View className="ml-[20px] flex-1" /> // 홀수로 남는 경우 칸 수정
                  )}
                </View>
              ))
            : options.map((label, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleSelect(index)}
                  className={`h-[58px] items-center justify-center rounded-lg p-[10px] ${
                    isSelected(index)
                      ? "border-[2px] border-main bg-sub"
                      : "bg-gray100"
                  }`}
                >
                  <Text
                    className={`text-center text-[16px] ${
                      isSelected(index)
                        ? "font-semibold text-main"
                        : "text-gray600"
                    }`}
                  >
                    {label}
                  </Text>
                </Pressable>
              ))}
        </View>
      </View>
      <View className="px-4 py-6">
        <Pressable
          className={`h-[47px] w-full items-center justify-center rounded-[6px] ${
            isNextDisabled ? "bg-gray300" : "bg-main"
          }`}
          disabled={isNextDisabled}
          onPress={() => selected !== null && onNext(selected)}
        >
          <Text
            className={`text-center text-xl font-semibold ${
              isNextDisabled ? "text-gray500" : "text-white"
            }`}
          >
            다음
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
