import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";

interface SearchIconProps {
  color?: string;
  size?: number;
}

export default function SearchIcon({
  color = "#9CA3AF",
  size = 24,
}: SearchIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 25 24" fill="none">
      <G clipPath="url(#clip0_335_3804)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.3102 17.1122C7.83024 17.1122 5.00023 14.2822 5.00023 10.8022C5.00023 7.32219 7.83024 4.49219 11.3102 4.49219C14.7902 4.49219 17.6202 7.32219 17.6202 10.8022C17.6202 14.2822 14.7902 17.1122 11.3102 17.1122ZM22.1302 20.5722L17.3302 15.7722C18.4402 14.4222 19.1102 12.6922 19.1102 10.8022C19.1102 6.49219 15.6202 2.99219 11.3002 2.99219C6.98023 2.99219 3.49023 6.48219 3.49023 10.8022C3.49023 15.1222 6.98023 18.6122 11.3002 18.6122C13.1902 18.6122 14.9202 17.9422 16.2702 16.8322L21.0702 21.6322C21.2202 21.7822 21.4102 21.8522 21.6002 21.8522C21.7902 21.8522 21.9802 21.7822 22.1302 21.6322C22.4202 21.3422 22.4202 20.8622 22.1302 20.5722Z"
          fill={color}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_335_3804">
          <Rect
            width="24"
            height="24"
            fill="white"
            transform="translate(0.5)"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
