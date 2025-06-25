// 각 선택지의 질문과 선택지 받기
import { useState } from "react";

import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Chevron from "@/components/icons/Chevron";

import Percentage from "./Percentage";
export default function SurveyStep({
  question,
  options,
  onNext,
  onBack,
  total,
  currentStep,
}: {
  question: string;
  options: string[];
  onNext: (answerIndex: number) => void;
  onBack?: () => void;
  total: number;
  currentStep: number;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <SafeAreaView className="w-full flex-1 justify-between">
      <Percentage current={currentStep} total={total} />
      <View className="relative h-[60px] items-center justify-center">
        <Text className="text-[20px] text-[#383535]">
          {currentStep}/{total}
        </Text>
        <Pressable
          className="absolute left-4 top-1/2 -translate-y-1/2"
          onPress={() => (onBack ? onBack() : router.back())}
        >
          <Chevron direction="left" />
        </Pressable>
      </View>
      <View className="flex-1 px-4">
        {/* 질문 */}
        <View className="mb-8 flex items-center">
          <Text className="text-xl font-semibold text-gray-800">
            {question}
          </Text>
        </View>

        {/* 선택지 */}
        <View className="flex-1">
          {options.map((label, index) => (
            <Pressable
              key={index}
              onPress={() => setSelected(index)}
              className={`mb-3 rounded-lg border-2 p-4 ${
                selected === index
                  ? "border-[#816BFF]"
                  : "border-gray-300 bg-white"
              }`}
            >
              <Text
                className={`text-lg ${
                  selected === index
                    ? "font-medium text-[#816BFF]"
                    : "text-gray-700"
                }`}
              >
                {label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Next Button */}
      </View>
      <View className="px-4 py-6">
        <Pressable
          className={`h-[47px] w-full items-center justify-center rounded-[6px] ${
            selected === null ? "bg-gray-300" : "bg-[#816BFF]"
          }`}
          disabled={selected === null}
          onPress={() => selected !== null && onNext(selected)}
        >
          <Text
            className={`text-center text-lg font-semibold ${
              selected === null ? "text-gray-500" : "text-white"
            }`}
          >
            다음으로
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
