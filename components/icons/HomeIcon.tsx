import Svg, { Path } from "react-native-svg";

interface HomeIconProps {
  color?: string;
  size?: number;
  isActive?: boolean;
}

export default function HomeIcon({
  color = "#9CA3AF",
  size = 24,
  isActive = false,
}: HomeIconProps) {
  return (
    <Svg
      width={size}
      height={size * (29 / 28)} // 원본 비율 유지 (28:29)
      viewBox="0 0 28 29"
      fill="none"
    >
      {isActive ? (
        // 활성화된 상태 - filled 아이콘
        <>
          <Path
            d="M4.66669 11.1064L14 5.16699L23.3334 11.1064V23.8337H4.66669V11.1064Z"
            fill="#6C4DFF"
            stroke="#6C4DFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M11.6667 16.833H16.3334"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      ) : (
        // 비활성화 상태 - outline 아이콘
        <>
          <Path
            d="M4.66675 11.1064L14.0001 5.16699L23.3334 11.1064V23.8337H4.66675V11.1064Z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <Path
            d="M11.6667 16.833H16.3334"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </>
      )}
    </Svg>
  );
}
