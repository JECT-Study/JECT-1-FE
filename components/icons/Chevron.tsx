import { Text } from "react-native";
import Svg, { Path } from "react-native-svg";

type Props = {
  direction: "left" | "right" | "down" | "up";
  strokeWidth?: number;
  size?: number;
};

export default function Chevron({
  direction,
  strokeWidth = 2,
  size = 24,
}: Props) {
  if (direction === "left") {
    return (
      <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width={strokeWidth}
        stroke-linecap="round"
        stroke-linejoin="round"
        className="lucide lucide-chevron-left-icon lucide-chevron-left"
      >
        <Path d="m15 18-6-6 6-6" />
      </Svg>
    );
  } else if (direction === "right") {
    return (
      <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width={strokeWidth}
        stroke-linecap="round"
        stroke-linejoin="round"
        className="lucide lucide-chevron-left-icon lucide-chevron-left"
      >
        <Path d="m9 18 6-6-6-6" />
      </Svg>
    );
  }
  return (
    <Text>
      자주 사용하는 컴포넌트 중 하나라 미리 만들었습니다.(LucideReact)
    </Text>
  );
}
