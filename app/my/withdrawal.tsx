import { router } from "expo-router";
import { SafeAreaView, View, Text } from "react-native";

import WithDrawForm from "@/components/mypage/WithDrawForm";
import CustomHeader from "@/components/ui/CustomHeader";
import { reason } from "@/constants/WithDrawal";

export default function Withdrawal() {
  return (
    <>
      <SafeAreaView className="w-full flex-1 bg-white">
        <CustomHeader
          title="회원탈퇴"
          isCommit={false}
          cancel={() => router.back()}
        />
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
