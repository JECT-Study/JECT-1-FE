import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";

interface HomeIconProps {
  color?: string;
  size?: number;
}

export default function HomeIcon({
  color = "#9CA3AF",
  size = 24,
}: HomeIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G clipPath="url(#clip0_335_3798)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14.6902 3.04031L21.3402 9.09031C21.7602 9.47031 21.9902 10.0103 21.9902 10.5703V20.4103C21.9902 21.5103 21.0902 22.4103 19.9902 22.4103H13.8102V14.3203C13.8102 13.8103 13.4202 13.3803 12.9302 13.3303H12.8102H11.1702C10.6202 13.3303 10.1702 13.7803 10.1702 14.3303V22.4203H3.99023C2.89023 22.4203 1.99023 21.5203 1.99023 20.4203V10.5803C1.99023 10.0203 2.23023 9.48031 2.64023 9.10031L9.29023 3.05031C10.8202 1.66031 13.1502 1.66031 14.6702 3.05031L14.6902 3.04031Z"
          fill={color}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_335_3798">
          <Rect width="24" height="24" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
