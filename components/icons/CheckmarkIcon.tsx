import Svg, { Path } from "react-native-svg";

interface Props {
  color?: string;
  size?: number;
}

export default function CheckmarkIcon({ color = "white", size = 10 }: Props) {
  return (
    <Svg width={size} height={(size * 8) / 10} viewBox="0 0 10 8" fill="none">
      <Path
        d="M0.833496 4.5549L3.9585 7.33268L9.16683 0.666016"
        stroke={color}
        strokeWidth="1.33"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
