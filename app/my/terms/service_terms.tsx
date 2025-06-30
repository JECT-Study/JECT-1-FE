import { router } from "expo-router";
import { SafeAreaView, Text } from "react-native";

import CustomHeader from "@/components/ui/CustomHeader";

export default function ServiceTerms() {
  return (
    <SafeAreaView className="w-full flex-1 items-center bg-white">
      // TODO : 이용약관 정해지면 내용 채우기 (pdf 뷰어를 사용할 것인지 그냥
      컴포넌트로 보여줄 것인지.)
      <CustomHeader
        title="서비스 이용 약관"
        isCommit={false}
        cancel={() => router.back()}
      />
      <Text>Hello</Text>
    </SafeAreaView>
  );
}
