import Svg, { Path } from "react-native-svg";

interface Props {
  color?: string;
  size?: number;
}

export default function CloseIcon({ color = "#6C4DFF", size = 20 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M5.33345 15.5447L4.45532 14.6665L9.12199 9.99987L4.45532 5.3332L5.33345 4.45508L10.0001 9.12175L14.6668 4.45508L15.5449 5.3332L10.8782 9.99987L15.5449 14.6665L14.6668 15.5447L10.0001 10.878L5.33345 15.5447Z"
        fill={color}
      />
    </Svg>
  );
}
