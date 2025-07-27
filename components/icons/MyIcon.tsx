import Svg, { Ellipse, Path } from "react-native-svg";

interface MyIconProps {
  color?: string;
  size?: number;
  isActive?: boolean;
}

export default function MyIcon({
  color = "#9CA3AF",
  size = 24,
  isActive = false,
}: MyIconProps) {
  return (
    <Svg
      width={size}
      height={size} // 29:29 비율이므로 정사각형 유지
      viewBox="0 0 29 29"
      fill="none"
    >
      {isActive ? (
        // 활성화된 상태 - filled 아이콘
        <>
          <Ellipse
            cx="14.5"
            cy="8.66699"
            rx="3.5"
            ry="3.5"
            fill="#6C4DFF"
            stroke="#6C4DFF"
            strokeWidth="2"
          />
          <Path
            d="M5.16675 20.833C5.16675 18.6239 6.95761 16.833 9.16675 16.833H19.8334C22.0426 16.833 23.8334 18.6239 23.8334 20.833V23.833H5.16675V20.833Z"
            fill="#6C4DFF"
            stroke="#6C4DFF"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </>
      ) : (
        // 비활성화 상태 - outline 아이콘
        <>
          <Ellipse
            cx="14.5"
            cy="8.66699"
            rx="3.5"
            ry="3.5"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
          <Path
            d="M5.16675 20.833C5.16675 18.6239 6.95761 16.833 9.16675 16.833H19.8334C22.0426 16.833 23.8334 18.6239 23.8334 20.833V23.833H5.16675V20.833Z"
            stroke={color}
            strokeWidth="2"
            strokeLinejoin="round"
            fill="none"
          />
        </>
      )}
    </Svg>
  );
}
