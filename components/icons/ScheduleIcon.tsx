import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";

interface ScheduleIconProps {
  color?: string;
  size?: number;
}

export default function ScheduleIcon({
  color = "#9CA3AF",
  size = 24,
}: ScheduleIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G clipPath="url(#clip0_335_3810)">
        <Path
          d="M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM12 3.5C7.31 3.5 3.5 7.31 3.5 12C3.5 16.69 7.31 20.5 12 20.5C16.69 20.5 20.5 16.69 20.5 12C20.5 7.31 16.69 3.5 12 3.5ZM14.3 14.31C14.68 14.47 14.85 14.92 14.69 15.3C14.27 16.28 13.32 16.75 12 16.75C10.68 16.75 9.74 16.28 9.31 15.3C9.15 14.92 9.31 14.48 9.7 14.31C10.05 14.16 10.45 14.29 10.64 14.61L10.69 14.7C10.84 15.06 11.23 15.25 12 15.25C12.71 15.25 13.1 15.09 13.27 14.78L13.31 14.7C13.47 14.32 13.92 14.15 14.3 14.31ZM9 10C9.55 10 10 10.45 10 11C10 11.55 9.55 12 9 12C8.45 12 8 11.55 8 11C8 10.45 8.45 10 9 10ZM15 10C15.55 10 16 10.45 16 11C16 11.55 15.55 12 15 12C14.45 12 14 11.55 14 11C14 10.45 14.45 10 15 10Z"
          fill={color}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_335_3810">
          <Rect width="24" height="24" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
