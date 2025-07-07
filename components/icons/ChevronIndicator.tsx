import Svg, { Path } from "react-native-svg";

type Props = {
  direction?: "up" | "down";
  width?: number;
  height?: number;
  strokeWidth?: number;
  color?: string;
};

export default function ChevronIndicator({
  direction = "down",
  width = 40,
  height = 12,
  strokeWidth = 3,
  color = "#CBCBCB",
}: Props) {
  const pathData =
    direction === "down"
      ? "M2 2L19.5939 9.81949C19.8524 9.93441 20.1476 9.93441 20.4061 9.81949L38 2"
      : "M38 10L20.4061 2.18051C20.1476 2.06559 19.8524 2.06559 19.5939 2.18051L2 10";

  return (
    <Svg width={width} height={height} viewBox="0 0 40 12" fill="none">
      <Path
        d={pathData}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
}
