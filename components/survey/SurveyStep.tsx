// 각 선택지의 질문과 선택지 받기
import { useState } from "react";

import { router } from "expo-router";
import { Alert, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Chevron from "@/components/icons/Chevron";

import SurveyStepBar from "./SurveyStepBar";
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
    <SafeAreaView className="w-full flex-1 justify-between bg-white">
      <View className="h-[60px] items-center justify-center">
        <SurveyStepBar current={currentStep} total={total} />
        <Pressable
          className="absolute left-4 top-1/2 -translate-y-1/2"
          onPress={() =>
            Alert.alert(
              "취향 분석을 그만 두시겠어요?",
              "선택한 내용은 저장되지 않아요.",
              [
                {
                  text: "계속 진행",
                  style: "cancel",
                },
                {
                  text: "네, 그만둘게요.",
                  style: "destructive",
                  onPress: () => router.back(),
                },
              ],
            )
          }
        >
          <Chevron direction="left" />
        </Pressable>
      </View>
      <View className="flex items-center">
        <Text className="justify-center text-[15px] text-[#9B9696]">
          {currentStep}/{total}
        </Text>
        <Text className="mb-4 mt-8 text-center text-2xl font-semibold text-gray-800">
          {question}
        </Text>
      </View>
      <View className="flex-1 px-4">
        <View className="flex-1 gap-[10px]">
          {options.map((label, index) => (
            <Pressable
              key={index}
              onPress={() => setSelected(index)}
              className={`rounded-lg py-[14px] ${
                selected === index
                  ? "border-[2px] border-[#816BFF] bg-[#DFDAFF]"
                  : "border-[1px] border-[#E8E9EB] bg-white"
              }`}
            >
              <Text
                className={`text-center text-sm ${
                  selected === index
                    ? "font-semibold text-[#3B465A]"
                    : "text-[#3B465A]"
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
