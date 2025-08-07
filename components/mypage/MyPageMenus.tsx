import axios, { AxiosError } from "axios";
import * as SecureStore from "expo-secure-store";
import { Alert, View } from "react-native";

import MyPageMenu from "@/components/mypage/MyPageMenu";
import { LogoutUrl } from "@/constants/ApiUrls";
import usePageNavigation from "@/hooks/usePageNavigation";

const handleLogout = () => {
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
          // TODO 실제 로그아웃 로직
          console.log("로그아웃!");
          try {
            const accessToken = await SecureStore.getItemAsync("accessToken");
            await axios.post(LogoutUrl, {
              headers: {
                authorization: `Bearer ${accessToken}`,
              },
            });
          } catch (error) {
            const axiosError = error as AxiosError;
            alert(`로그아웃 도중 에러가 발생했습니다. ${axiosError.message}`);
          } finally {
            await SecureStore.deleteItemAsync("accessToken");
            await SecureStore.deleteItemAsync("refreshToken");
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
