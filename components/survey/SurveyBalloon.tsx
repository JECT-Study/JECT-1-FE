import { Image } from "expo-image";
import { router } from "expo-router";
import { Alert, Platform, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Confetti from "@/components/survey/Confetti";
import CustomHeader from "@/components/ui/CustomHeader";

interface Props {
  type: "END" | "INTRO";
  onNext: () => void;
}

export default function SurveyBalloon({ type, onNext }: Props) {
  const handleCancel = () => {
    if (Platform.OS === "web") {
      // 웹에서는 window.confirm 사용
      const confirmed = window.confirm(
        "취향 분석을 그만 두시겠어요?\n선택한 내용은 저장되지 않아요.",
      );

      if (confirmed) {
        router.back();
      }
      return;
    }

    // 네이티브에서는 Alert.alert 사용
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
    );
  };

  return (
    <SafeAreaView className="flex-1 justify-between bg-white">
      <CustomHeader
        title={"취향 분석"}
        isCommit={false}
        cancel={handleCancel}
      />
      {type === "END" ? <Confetti /> : null}
      <View className="w-full items-center pt-20">
        <Text className="text-[24px] font-semibold text-[#816BFF]">
          {type === "INTRO" ? "나의 콘텐츠 취향" : "설문이 끝났습니다."}
        </Text>
        <Text className="text-[24px] font-semibold text-[#816BFF]">
          {type === "INTRO"
            ? "지금 바로 알아볼까요?"
            : "지금 결과를 확인해보세요!"}
        </Text>
      </View>
      <View className="flex-1 items-center justify-center">
        <Image
          source={require("@/assets/images/survey/balloon.png")}
          style={{ width: 256, height: 256 }}
        />
      </View>
      <View className="px-4 py-6">
        {type === "INTRO" ? (
          <View className="mx-auto">
            <Text className="w-full p-5 font-normal text-[#8A8A8A]">
              6문항으로 나만의 콘텐츠 리스트 완성!
            </Text>
          </View>
        ) : null}
        <Pressable
          className={`z-50 h-[47px] w-full items-center justify-center rounded-[6px] bg-[#816BFF]`}
          onPress={onNext}
        >
          <Text className={`text-[15px] text-white`}>
            {type === "INTRO" ? "설문 시작하기" : "마이코드 시작하기"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
