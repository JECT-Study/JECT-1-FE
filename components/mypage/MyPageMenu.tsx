import { Pressable, Text } from "react-native";

import Chevron from "@/components/icons/Chevron";

type Props = {
  title: string;
  onPress: () => void;
};

export default function MyPageMenu({ title, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="flex h-[50px] w-full flex-row items-center justify-between border-b-[1px] border-[#E5E5EC]"
    >
      <Text className="text-[14px]">{title}</Text>
      <Chevron direction={"right"} />
    </Pressable>
  );
}
