import { router } from "expo-router";
import { Alert } from "react-native";

export default function SurveyAlert() {
  return Alert.alert(
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
}
