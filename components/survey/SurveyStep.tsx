// 각 선택지의 질문과 선택지 받기
import { useState } from "react";

import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

import Percentage from "./Percentage";
import { SafeAreaView } from "react-native-safe-area-context";

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
    <SafeAreaView className="flex-1">
      <Percentage current={currentStep} total={total} />
      <View className="flex-1 px-6 py-8">
        {/* 진행상태 */}
        <View className="mb-8 flex-row items-center justify-between">
          {currentStep > 1 ? (
            <Pressable
              onPress={() => (onBack ? onBack() : router.back())}
              className="flex-row items-center"
            >
              <Text className="text-lg text-black">뒤로가기</Text>
            </Pressable>
          ) : (
            <View className="w-12" />
          )}
          <Text className="text-lg text-black">
            {currentStep} / {total}
          </Text>
          <View className="w-12" />
        </View>

        {/* 질문 */}
        <View className="mb-8 flex items-center">
          <Text className="text-xl font-semibold text-gray-800">
            {question}
          </Text>
        </View>

        {/* 선택지 */}
        <View className="mb-6 flex-1">
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
        <View className="mb-10">
          <Pressable
            className={`rounded-[23px] px-6 py-4 ${
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
      </View>
    </SafeAreaView>
  );
}
