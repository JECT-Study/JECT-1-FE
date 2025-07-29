import { Pressable, Text, View } from "react-native";

import XIcon from "@/components/icons/X";

type Props = {
  title: string;
  onClickText: () => void;
  onClick: () => void;
};

export default function RecentSearchListButton({
  title,
  onClick,
  onClickText,
}: Props) {
  return (
    <View className="flex flex-row items-center justify-center gap-1 rounded-[20px] bg-sub px-3 py-1.5">
      <Pressable onPress={onClickText}>
        <Text className="text-[#6B51FB]">{title}</Text>
      </Pressable>
      <Pressable onPress={onClick}>
        <XIcon size={20} color="#6B51FB" />
      </Pressable>
    </View>
  );
}
