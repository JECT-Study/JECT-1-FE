// 각 선택지의 질문과 선택지 받기
import { useState } from "react";

import { Button, TouchableOpacity, View, Text } from "react-native";

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
    <View className="p-20">
      <Text>
        {currentStep}/{total}
      </Text>
      <Text style={{ marginBottom: 20 }}>{question}</Text>
      {options.map((label, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => setSelected(index)}
          style={{
            padding: 12,
            marginBottom: 10,
            borderWidth: 1,
            borderColor: selected === index ? "blue" : "#ccc",
            borderRadius: 6,
          }}
        >
          <Text>{label}</Text>
        </TouchableOpacity>
      ))}
      <Button
        title="다음으로"
        disabled={selected === null}
        onPress={() => selected !== null && onNext(selected)}
      />
    </View>
  );
}
