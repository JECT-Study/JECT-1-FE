import Svg, { Path } from "react-native-svg";

interface SearchIconProps {
  color?: string;
  size?: number;
}

export default function SearchIcon({
  color = "#9CA3AF",
  size = 24,
}: SearchIconProps) {
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
