import { View } from "react-native";

import MyMenu from "@/components/mypage/MyMenu";

export default function MyMenus() {
  return (
    <View className="my-4 flex flex-row justify-center">
      <MyMenu title="나의일정" onPress={() => console.log("나의일정")} />
      <MyMenu title="찜" onPress={() => console.log("나의일정")} />
      <MyMenu
        title="취향 분석"
        onPress={() => console.log("취향 분석 다시하기")}
      />
    </View>
  );
}
