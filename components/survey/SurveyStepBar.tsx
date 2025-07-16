import { View } from "react-native";

export default function SurveyStepBar({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <View className="flex w-full flex-row justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          className={`mx-[3px] h-1.5 w-8 rounded-[3px] ${i < current ? "bg-[#816BFF]" : "bg-[#DFE2E9]"}`}
        />
      ))}
    </View>
  );
}
