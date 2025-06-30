import { router } from "expo-router";
import { SafeAreaView, View, Text, Pressable } from "react-native";

import Chevron from "@/components/icons/Chevron";
import WithDrawForm from "@/components/mypage/WithDrawForm";
import { reason } from "@/constants/WithDrawal";

export default function Withdrawal() {
  return (
    <>
      <SafeAreaView className="w-full flex-1 bg-white">
        <View className="relative h-[60px] items-center justify-center border-b-[0.5px] border-[#DCDEE3]">
          <Text className="text-[16px] font-medium text-[#383535]">
            회원탈퇴
          </Text>
          <Pressable
            className="absolute left-4 top-1/2 -translate-y-1/2"
            onPress={() => router.replace("/(tabs)/my")}
          >
            <Chevron direction="left" />
          </Pressable>
        </View>
        <Text className="m-6 text-[18px] font-medium">
          서비스를 탈퇴하는 이유가 궁금해요.
        </Text>
        <View className="flex-1 px-6">
          <WithDrawForm title="탈퇴 사유를 선택해주세요" items={reason} />
        </View>
      </SafeAreaView>
    </>
  );
}
