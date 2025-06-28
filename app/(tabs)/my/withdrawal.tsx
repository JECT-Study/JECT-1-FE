import { router } from "expo-router";
import { SafeAreaView, View, Text, Pressable } from "react-native";

import Chevron from "@/components/icons/Chevron";

export default function Withdrawal() {
  return (
    <>
      <SafeAreaView className="w-full flex-1 bg-white">
        <View className="relative h-[60px] items-center justify-center">
          <Text className="text-[20px] text-[#383535]">회원탈퇴</Text>
          <Pressable
            className="absolute left-4 top-1/2 -translate-y-1/2"
            onPress={() => router.replace("/(tabs)/my")}
          >
            <Chevron direction="left" />
          </Pressable>
        </View>
        <View className="w-full px-4">
          <Text>탈퇴사유를 알려주세요</Text>
        </View>
      </SafeAreaView>
    </>
  );
}
