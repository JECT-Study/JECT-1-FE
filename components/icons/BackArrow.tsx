import Svg, { Path } from "react-native-svg";

interface Props {
  color?: string;
  size?: number;
}

export default function BackArrow({ color = "#212121", size = 20 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M13.3327 16.6673L6.66602 10.0006L13.3327 3.33398"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
