import Svg, { Circle, Ellipse, Path } from "react-native-svg";

interface ShareOutlineIconProps {
  size?: number;
  color?: string;
}

export default function ShareOutlineIcon({
  size = 28,
  color = "#212121",
}: ShareOutlineIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Ellipse
        cx="7.58342"
        cy="14.5827"
        rx="2.91667"
        ry="2.91667"
        stroke={color}
        strokeWidth="2"
      />
      <Ellipse
        cx="20.4167"
        cy="7.58268"
        rx="2.91667"
        ry="2.91667"
        stroke={color}
        strokeWidth="2"
      />
      <Circle
        cx="20.4167"
        cy="20.4167"
        r="2.91667"
        stroke={color}
        strokeWidth="2"
      />
      <Path
        d="M10.5 12.8333L17.5 8.75"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10.5 16.3333L17.5 19.25"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
