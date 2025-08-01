import { Pressable, Text, View } from "react-native";

import Chevron from "@/components/icons/Chevron";
import XIcon from "@/components/icons/X";

type Props = {
  title: string;
  // X 눌렀을 때 수행할 동작
  cancel?: () => void;
  // 확인 여부
  isCommit: boolean;
  // 확인시 수행할 로직
  commit?: () => void;
  // seperator 여부
  separator?: boolean;
};

export default function CustomHeader({
  title,
  cancel,
  isCommit,
  commit,
  separator,
}: Props) {
  return (
    <View
      aria-label={`${title} header`}
      className={`relative z-50 flex h-[60px] w-full flex-row items-center justify-between ${separator ? "border-b-2 border-gray-100" : ""} p-4`}
    >
      <Pressable
        onPress={cancel ? cancel : null}
        className="w-[60px] items-start"
      >
        {isCommit ? <XIcon size={24} /> : <Chevron direction="left" />}
      </Pressable>

      <View className="flex-1 items-center">
        <Text className="text-[18px] font-semibold text-[#383535]">
          {title}
        </Text>
      </View>

      {isCommit ? (
        <Pressable
          onPress={commit ? commit : null}
          className="w-[60px] items-end"
        >
          <Text className="text-[16px] text-[#383535]">완료</Text>
        </Pressable>
      ) : (
        <View className="w-[60px]" />
      )}
    </View>
  );
}
