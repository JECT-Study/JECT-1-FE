import { useEffect, useState } from "react";

import { useNavigation } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import Chevron from "@/components/icons/Chevron";
import { chunk } from "@/features/survey/chunkOption";

import SurveyStepBar from "./SurveyStepBar";

export default function SurveyStep({
  question,
  options,
  onNext,
  onBack,
  total,
  currentStep,
  dividedOptions,
}: {
  question: string;
  options: string[];
  dividedOptions?: boolean;
  onNext: (answerIndex: number) => void;
  onBack: () => void;
  total: number;
  currentStep: number;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  const navigation = useNavigation();

  const optionRows = dividedOptions ? chunk(options, 2) : [];

  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
      swipeEnabled: false,
    });
  }, [navigation]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="w-full flex-1 justify-between bg-white">
        <View className="h-[60px] items-center justify-center">
          <SurveyStepBar current={currentStep} total={total} />
          <Pressable
            className="absolute left-4 top-1/2 -translate-y-1/2"
            onPress={onBack}
          >
            <Chevron direction="left" />
          </Pressable>
        </View>
        <View className="flex items-center">
          <Text className="justify-center text-[15px] text-[#9B9696]">
            {currentStep}/{total}
          </Text>
          <Text className="mb-4 mt-8 text-center text-2xl font-semibold text-gray800">
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
                          onPress={() => setSelected(globalIndex)}
                          className={`h-[58px] flex-1 items-center justify-center rounded-lg p-[10px] ${
                            selected === globalIndex
                              ? "border-[2px] border-main bg-sub"
                              : "bg-gray100"
                          }`}
                        >
                          <Text
                            className={`text-center text-[16px] ${
                              selected === globalIndex
                                ? "font-semibold text-main"
                                : "text-gray600"
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
                    onPress={() => setSelected(index)}
                    className={`h-[58px] items-center justify-center rounded-lg p-[10px] ${
                      selected === index
                        ? "border-[2px] border-main bg-sub"
                        : "bg-gray100"
                    }`}
                  >
                    <Text
                      className={`text-center text-[16px] ${
                        selected === index
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
              selected === null ? "bg-gray300" : "bg-main"
            }`}
            disabled={selected === null}
            onPress={() => selected !== null && onNext(selected)}
          >
            <Text
              className={`text-center text-lg font-semibold ${
                selected === null ? "text-gray500" : "text-white"
              }`}
            >
              다음
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
