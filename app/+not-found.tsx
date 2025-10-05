import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, Text, View } from "react-native";

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <>
      <StatusBar style="dark" />
      <View className="flex-1 items-center justify-center bg-white p-5">
        <Text className="mb-4 text-3xl font-bold text-[#424242]">
          페이지를 찾을 수 없습니다
        </Text>
        <Pressable
          className="mt-6 rounded-lg bg-[#6C4DFF] px-8 py-4"
          onPress={() => router.push("/")}
          style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
        >
          <Text className="text-center text-lg font-semibold text-white">
            홈으로 돌아가기
          </Text>
        </Pressable>
      </View>
    </>
  );
}
