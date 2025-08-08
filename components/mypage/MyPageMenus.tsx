import { AxiosError } from "axios";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Alert, View } from "react-native";

import MyPageMenu from "@/components/mypage/MyPageMenu";
import { LogoutUrl } from "@/constants/ApiUrls";
import { authApi } from "@/features/axios/axiosInstance";
import usePageNavigation from "@/hooks/usePageNavigation";

const handleLogout = async () => {
  Alert.alert(
    "로그아웃", // 타이틀
    "정말 로그아웃 하시겠어요?", // 메시지
    [
      {
        text: "취소",
        style: "default", // iOS에서 취소 강조
      },
      {
        text: "로그아웃",
        onPress: async () => {
          try {
            await authApi.post(LogoutUrl);
            await SecureStore.deleteItemAsync("accessToken");
            await SecureStore.deleteItemAsync("refreshToken");
            alert("로그아웃이 완료되었습니다.");
            router.replace("/");
            // TODO: 해당 경로로 이동하면, 로그인 창이 안나오는 이슈 발생.
          } catch (error) {
            const axiosError = error as AxiosError;
            alert(`로그아웃 도중 에러가 발생했습니다. ${axiosError.message}`);
          }
        },
        style: "default",
      },
    ],
    { cancelable: true },
  );
};

export default function MyPageMenus() {
  const { goTerms, goWithdrawal } = usePageNavigation();
  return (
    <View className="w-full px-4">
      <MyPageMenu title="이용약관" onPress={() => goTerms()} chevron={true} />
      <MyPageMenu title="로그아웃" onPress={handleLogout} chevron={true} />
      <MyPageMenu
        title="회원탈퇴"
        onPress={() => goWithdrawal()}
        chevron={true}
      />
    </View>
  );
}
