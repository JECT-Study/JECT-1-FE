import Svg, { Path } from "react-native-svg";

interface SearchIconProps {
  color?: string;
  size?: number;
  isActive?: boolean;
}

export default function SearchIcon({
  color = "#9CA3AF",
  size = 24,
  isActive = false,
}: SearchIconProps) {
  if (isActive) {
    // 활성화 상태: filled 아이콘
    return (
      <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <Path
          d="M22.6262 24.0404C23.0168 24.431 23.6499 24.431 24.0404 24.0404C24.431 23.6499 24.431 23.0168 24.0404 22.6262L23.3333 23.3333L22.6262 24.0404ZM17.5 17.5L16.7929 18.2071L22.6262 24.0404L23.3333 23.3333L24.0404 22.6262L18.2071 16.7929L17.5 17.5Z"
          fill="#6C4DFF"
        />
        <Path
          d="M13.2515 21.837C17.9929 21.837 21.8365 17.9934 21.8365 13.252C21.8365 8.51063 17.9929 4.66699 13.2515 4.66699C8.51014 4.66699 4.6665 8.51063 4.6665 13.252C4.6665 17.9934 8.51014 21.837 13.2515 21.837Z"
          fill="#6C4DFF"
        />
        <Path
          d="M7.49894 15.2988C6.36853 12.1216 8.02781 8.62952 11.205 7.49911"
          stroke="white"
          strokeWidth="1.3"
          strokeMiterlimit="10"
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  // 비활성화 상태: outline 아이콘
  return (
    <Svg
      width={size}
      height={size * (29 / 28)} // 원본 비율 유지 (28:29)
      viewBox="0 0 28 29"
      fill="none"
    >
      <Path
        d="M12.2501 20.3337C16.4382 20.3337 19.8334 16.9385 19.8334 12.7503C19.8334 8.56217 16.4382 5.16699 12.2501 5.16699C8.06192 5.16699 4.66675 8.56217 4.66675 12.7503C4.66675 16.9385 8.06192 20.3337 12.2501 20.3337Z"
        stroke={color}
        strokeWidth="2"
        strokeMiterlimit="10"
        fill="none"
      />
      <Path
        d="M22.6262 24.5404C23.0168 24.931 23.6499 24.931 24.0404 24.5404C24.431 24.1499 24.431 23.5168 24.0404 23.1262L22.6262 24.5404ZM17.5 18L16.7929 18.7071L22.6262 24.5404L23.3333 23.8333L24.0404 23.1262L18.2071 17.2929L17.5 18Z"
        fill={color}
      />
    </Svg>
  );
}
