import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

import Confetti from "@/components/survey/Confetti";
import CustomHeader from "@/components/ui/CustomHeader";

interface Props {
  type: "END" | "INTRO";
  onNext: () => void;
}

export default function SurveyBalloon({ type, onNext }: Props) {
  return (
    <View className="flex-1 justify-between bg-white">
      <CustomHeader
        title="취향 분석"
        isCommit={false}
        cancel={type === "END" ? undefined : () => router.back()}
      />
      {type === "END" ? <Confetti /> : null}
      <View className="w-full items-center pt-16">
        <Text className="text-3xl font-semibold text-[#6C4DFF]">
          {type === "INTRO" ? "나의 전시·공연 취향," : "설문이 끝났습니다."}
        </Text>
        <Text className="text-3xl font-semibold text-[#6C4DFF]">
          {type === "INTRO" ? "지금 알아볼까요?" : "지금 결과를 확인해보세요!"}
        </Text>
      </View>
      <View className="flex-1 items-center justify-center">
        <Image
          source={require("@/assets/images/survey/balloon.png")}
          style={{ width: 256, height: 256 }}
        />
      </View>
      <View className="px-4 py-6">
        {type === "INTRO" && (
          <View className="mx-auto">
            <Text className="w-full p-5 text-lg font-normal text-[#9E9E9E]">
              6문항으로 나만의 콘텐츠 리스트 완성!
            </Text>
          </View>
        )}
        <Pressable
          className="z-50 h-[52px] w-full items-center justify-center rounded-md bg-[#6C4DFF]"
          onPress={() => onNext()}
        >
          <Text className="text-lg font-medium text-white">
            {type === "INTRO" ? "취향 분석 시작" : "마이코드 시작하기"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
