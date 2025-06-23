import { useEffect, useState } from "react";

import { ActivityIndicator, Button, Text, View } from "react-native";

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
      console.log(context); // context엔 각 step에 어떤 값을 선택했는지 명시되어있음.
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
          <Button
            title="처음으로"
            onPress={() => history.replace("step1", {})}
          ></Button>
        </View>
      )}
    </View>
  );
}
