import Svg, { Rect, Path } from "react-native-svg";

interface DropdownIconProps {
  color?: string;
  size?: number;
  strokeColor?: string;
  backgroundColor?: string;
}

export default function DropdownIcon({
  color = "#8C8A98",
  size = 22,
  strokeColor = "#EEEEEE",
  backgroundColor = "white",
}: DropdownIconProps) {
  return (
    <Svg width={size} height={size + 1} viewBox="0 0 22 23" fill="none">
      <Rect
        x="0.5"
        y="22"
        width="21"
        height="21"
        rx="10.5"
        transform="rotate(-90 0.5 22)"
        fill={backgroundColor}
        stroke={strokeColor}
      />
      <Path
        d="M15 10.5L11 14.5L7 10.5"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
