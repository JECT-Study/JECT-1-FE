import Svg, { Path } from "react-native-svg";

interface LocationPinIconProps {
  size?: number;
  color?: string;
}

export default function LocationPinIcon({
  size = 13,
  color = "#111111",
}: LocationPinIconProps) {
  const scale = size / 13; // 원본 크기 13을 기준으로 스케일링
  const scaledWidth = 13 * scale;
  const scaledHeight = 12 * scale;

  return (
    <Svg
      width={scaledWidth}
      height={scaledHeight}
      viewBox="0 0 13 12"
      fill="none"
    >
      <Path
        d="M4 9C3.08554 9.20584 2.5 9.52213 2.5 9.87683C2.5 10.4971 4.29086 11 6.5 11C8.70914 11 10.5 10.4971 10.5 9.87683C10.5 9.52213 9.91446 9.20584 9 9"
        stroke={color}
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      <Path
        d="M7.75 4.5C7.75 5.19036 7.19036 5.75 6.5 5.75C5.80964 5.75 5.25 5.19036 5.25 4.5C5.25 3.80964 5.80964 3.25 6.5 3.25C7.19036 3.25 7.75 3.80964 7.75 4.5Z"
        stroke={color}
        strokeWidth="0.8"
      />
      <Path
        d="M7.1287 8.74679C6.96006 8.90921 6.73466 9 6.50008 9C6.2655 9 6.04009 8.90921 5.87145 8.74679C4.32715 7.25039 2.25759 5.57877 3.26685 3.15187C3.81255 1.83966 5.12247 1 6.50008 1C7.87768 1 9.1876 1.83966 9.7333 3.15187C10.7413 5.57571 8.67681 7.25555 7.1287 8.74679Z"
        stroke={color}
        strokeWidth="0.8"
      />
    </Svg>
  );
}
