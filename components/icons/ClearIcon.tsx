import Svg, { Circle, Line } from "react-native-svg";

interface Props {
  color?: string;
  size?: number;
}

export default function ClearIcon({ color = "#9CA3AF", size = 18 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <Circle cx="9" cy="9" r="9" fill={color} />
      <Line
        x1="5.4"
        y1="5.4"
        x2="12.6"
        y2="12.6"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <Line
        x1="12.6"
        y1="5.4"
        x2="5.4"
        y2="12.6"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </Svg>
  );
}
