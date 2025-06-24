import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Chevron from "@/components/icons/Chevron";

export default function SurveyIntro({ onNext }: { onNext: () => void }) {
  return (
    <SafeAreaView className="flex-1 justify-between">
      <View className="relative h-[60px] items-center justify-center">
        <Text className="text-[20px] text-[#383535]">성향 테스트</Text>
        <Pressable
          className="absolute left-4 top-1/2 -translate-y-1/2"
          onPress={() => router.replace("/")}
        >
          <Chevron direction="left" />
        </Pressable>
      </View>
      <View className="flex-1 items-center justify-center">
        <Image
          source={require("@/assets/images/survey/survey_intro.png")}
          style={{ width: 60, height: 51 }}
        />
        <View className="items-center justify-center p-4 text-[16px]">
          <Text className="m-1">테스트는 8문항이에요!</Text>
          <Text className="m-1">나에게 맞다고 생각되는 답변을 골라주세요.</Text>
        </View>
      </View>
      <View className="px-4 py-6">
        <Pressable
          className={`h-[47px] w-full items-center justify-center rounded-[6px] bg-[#816BFF]`}
          onPress={() => onNext()}
        >
          <Text className={`text-[15px] text-white`}>테스트 시작</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
