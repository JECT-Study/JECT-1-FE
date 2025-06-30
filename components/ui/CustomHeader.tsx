import { Pressable, Text, View } from "react-native";

import XIcon from "@/components/icons/X";

type Props = {
  title: string;
  // X 눌렀을 때 수행할 동작
  cancel?: () => void;
  // 확인 여부
  isCommit: boolean;
  // 확인시 수행할 로직
  commit?: () => void;
};

export default function CustomHeader({
  title,
  cancel,
  isCommit,
  commit,
}: Props) {
  return (
    <View
      aria-label={`${title} header`}
      className="relative flex h-[60px] w-full flex-row items-center justify-between border-2 border-gray-100 p-4"
    >
      <Pressable
        onPress={cancel ? cancel : null}
        className="w-[60px] items-start"
      >
        <XIcon size={24} />
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
      ) : null}
    </View>
  );
}
