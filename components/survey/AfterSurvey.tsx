import { useEffect, useState } from "react";

import { router } from "expo-router";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

export default function AfterSurvey({
  context,
  history,
}: {
  context: any;
  history: any;
}) {
  const [isLoading, setIsLoading] = useState(true);

  // TODO: 나중에 백엔드 구현되면, 실제 응답이 오는 것을 고려한 로직 재설계
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer); // cleanup
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      {isLoading ? (
        <>
          <ActivityIndicator size="large" color="#816BFF" />
          <Text className="mt-4 text-lg font-medium text-gray-700">
            성향 분석 중...
          </Text>
        </>
      ) : (
        <View>
          <Text className="text-xl font-semibold text-[#816BFF]">
            분석 완료 🎉
          </Text>
          <Text>{JSON.stringify(context)}</Text>
          <Pressable
            onPress={() => router.push("/(tabs)")}
            className="flex-row items-center justify-center gap-2 rounded-xl bg-gray-500 px-6 py-4 shadow-md active:opacity-80"
          >
            <Text className="text-base font-semibold text-white">둘러보기</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
