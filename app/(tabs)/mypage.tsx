import { router } from "expo-router";
import { Pressable, SafeAreaView, Text, View } from "react-native";

import MyMenus from "@/components/mypage/MyMenus";
import MyPageMenus from "@/components/mypage/MyPageMenus";
import UserInfo from "@/components/mypage/UserInfo";
import usePageNavigation from "@/hooks/usePageNavigation";
import { useIsLoggedIn } from "@/stores/useUserStore";

export default function MyScreen() {
  const { goEditProfile } = usePageNavigation();
  const isLoggedIn = useIsLoggedIn();

  // 로그인이 필요한 레이어 컴포넌트
  const LoginRequiredLayer = () => (
    <SafeAreaView className="w-full flex-1 bg-white">
      <Text className="ml-6 mt-10 text-[18px]">마이페이지</Text>
      <View className="flex-1 items-center justify-center px-6">
        <View className="mb-8 items-center">
          <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-gray-200">
            <Text className="text-2xl">🔒</Text>
          </View>
          <Text className="mb-2 text-xl font-semibold text-gray-800">
            로그인이 필요합니다
          </Text>
          <Text className="text-center leading-6 text-gray-600">
            마이페이지를 이용하려면{"\n"}먼저 로그인해주세요.
          </Text>
        </View>
        <Pressable
          className="w-full items-center rounded-lg bg-[#816BFF] py-4"
          onPress={() => {
            router.replace("/");
          }}
        >
          <Text className="text-lg font-semibold text-white">
            로그인하러 가기
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );

  // 로그인 상태가 아니면 로그인 필요 레이어 표시
  if (!isLoggedIn) {
    return <LoginRequiredLayer />;
  }

  return (
    <SafeAreaView className="w-full flex-1 bg-white">
      <Text className="ml-6 mt-10 text-[18px]">마이페이지</Text>
      <UserInfo />
      <Pressable
        className="mx-6 mt-6 flex h-[32px] items-center justify-center rounded-[4px] bg-gray-100"
        onPress={() => goEditProfile()}
      >
        <Text className="text-[12px]">프로필 수정</Text>
      </Pressable>
      <MyMenus />
      <View
        aria-label="seperator"
        className="my-2 h-[12px] w-full bg-[#F2F2F7]"
      />
      <MyPageMenus />
    </SafeAreaView>
  );
}
