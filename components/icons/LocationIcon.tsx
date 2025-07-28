import Svg, { Circle, Path, Rect } from "react-native-svg";

interface LocationIconProps {
  size?: number;
  color?: string;
}

export default function LocationIcon({
  size = 16,
  color = "#111111",
}: LocationIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Rect width="16" height="16" fill="white" />
      <Circle cx="7.99951" cy="6.76074" r="1.97949" stroke={color} />
      <Path
        d="M7.9999 13.8266C10.1852 11.4956 12.3704 9.40843 12.3704 6.83375C12.3704 4.25907 10.4137 2.17188 7.9999 2.17188C5.58614 2.17188 3.62939 4.25907 3.62939 6.83375C3.62939 9.40843 5.81465 11.4956 7.9999 13.8266Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
