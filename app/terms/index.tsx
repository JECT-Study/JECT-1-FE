import { router } from "expo-router";
import { Pressable, SafeAreaView, Text, View } from "react-native";

import Chevron from "@/components/icons/Chevron";
import MyPageMenu from "@/components/mypage/MyPageMenu";

export default function Terms() {
  return (
    <>
      <SafeAreaView className="w-full flex-1 bg-white">
        <View className="relative h-[60px] items-center justify-center">
          <Text className="text-[20px] text-[#383535]">이용약관</Text>
          <Pressable
            className="absolute left-4 top-1/2 -translate-y-1/2"
            onPress={() => router.back()}
          >
            <Chevron direction="left" />
          </Pressable>
        </View>
        <View className="w-full px-4">
          <MyPageMenu
            title="서비스 이용약관"
            onPress={() => router.push("/my/terms/service_terms")}
            chevron={true}
          />
          <MyPageMenu
            title="개인 정보 처리방침"
            onPress={() => router.push("/my/terms/service_privacy")}
            chevron={true}
          />
          <MyPageMenu
            title="위치기반 서비스 이용약관"
            onPress={() => router.push("/my/terms/service_location")}
            chevron={true}
          />
        </View>
      </SafeAreaView>
    </>
  );
}
