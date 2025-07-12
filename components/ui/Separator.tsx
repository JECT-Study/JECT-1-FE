import { View } from "react-native";

interface Props {
  color?: string;
}

export default function Separator({ color = "#EEE" }: Props) {
  return (
    <View className={`h-[1px] w-full`} style={{ backgroundColor: color }} />
  );
}
