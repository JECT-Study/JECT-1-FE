import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";

interface MyIconProps {
  color?: string;
  size?: number;
}

export default function MyIcon({ color = "#9CA3AF", size = 24 }: MyIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G clipPath="url(#clip0_335_3817)">
        <Path
          d="M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM12 3.5C7.31 3.5 3.5 7.31 3.5 12C3.5 16.69 7.31 20.5 12 20.5C16.69 20.5 20.5 16.69 20.5 12C20.5 7.31 16.69 3.5 12 3.5Z"
          fill={color}
        />
        <Path
          d="M12 6.5V12.5"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="bevel"
        />
        <Path
          d="M7 12.5H12"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="bevel"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_335_3817">
          <Rect width="24" height="24" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
