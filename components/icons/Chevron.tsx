import Svg, { Path } from "react-native-svg";

type Props = {
  direction: "left" | "right" | "down";
  color?: string;
  size?: number;
};

export default function Chevron({
  direction = "left",
  color = "#222222",
  size = 24,
}: Props) {
  const pathD = {
    left: "M16 20L8 12L16 4",
    right: "M8 4l8 8-8 8",
    down: "M4 8l8 8 8-8",
  };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d={pathD[direction]}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
