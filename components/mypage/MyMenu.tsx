import { Pressable, Text } from "react-native";

type Props = {
  title: string;
  onPress: () => void;
};

export default function MyMenu({ title, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="m-2 flex h-[70px] w-[105px] items-center justify-center"
    >
      <Text>{title}</Text>
    </Pressable>
  );
}
