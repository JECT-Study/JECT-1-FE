import Svg, { Path } from "react-native-svg";

interface HeartOutlineIconProps {
  size?: number;
  color?: string;
}

export default function HeartOutlineIcon({
  size = 28,
  color = "#212121",
}: HeartOutlineIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Path
        d="M14 23.334L5.20763 15.129C2.93079 13.0031 2.93079 9.55429 5.20763 7.4284C7.48447 5.30251 11.1816 5.30251 13.4584 7.4284L14 7.93285L14.5416 7.4284C16.8184 5.30251 20.5155 5.30251 22.7924 7.4284C25.0692 9.55429 25.0692 13.0031 22.7924 15.129L14 23.334Z"
        stroke={color}
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
