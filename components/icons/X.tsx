import Svg, { Path } from "react-native-svg";

export default function XIcon({ size }: { size: number }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <Path d="M18 6 6 18" />
      <Path d="m6 6 12 12" />
    </Svg>
  );
}
