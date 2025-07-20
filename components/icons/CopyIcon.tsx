import Svg, { Path, Rect } from "react-native-svg";

interface Props {
  color?: string;
  size?: number;
}

export default function CopyIcon({ color = "#186ADE", size = 16 }: Props) {
  return (
    <Svg width={size} height={size + 1} viewBox="0 0 16 17" fill="none">
      <Rect
        x="2.66675"
        y="3.16602"
        width="8"
        height="8"
        stroke={color}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <Path
        d="M13.3333 6.5V13.8333H6"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
