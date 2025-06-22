// 각 선택지의 질문과 선택지 받기
import { useState } from "react";

import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

import Percentage from "./Percentage";

export default function SurveyStep({
  question,
  options,
  onNext,
  total,
  currentStep,
}: {
  question: string;
  options: string[];
  onNext: (answerIndex: number) => void;
  total: number;
  currentStep: number;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Percentage current={currentStep} total={total} />
      <View className="flex-1 px-6 py-8">
        {/* 진행상태 */}
        <View className="mb-8 items-center">
          <Text className="text-lg text-gray-500">
            {currentStep} / {total}
          </Text>
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
            <TouchableOpacity
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
            </TouchableOpacity>
          ))}
        </View>

        {/* Next Button */}
        <View className="mb-10">
          <TouchableOpacity
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
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
