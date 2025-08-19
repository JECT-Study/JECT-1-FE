import { router } from "expo-router";
import { Alert, Platform } from "react-native";

export default function SurveyAlert() {
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
