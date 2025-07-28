import Svg, { Path } from "react-native-svg";

interface Props {
  color?: string;
}

export default function BackArrow({ color = "#111111" }: Props) {
  return (
    <Svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <Path
        d="M18.6666 23.3327L9.33325 13.9993L18.6666 4.66602"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
