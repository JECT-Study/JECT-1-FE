import { Path, Svg } from "react-native-svg";

interface CloseXProps {
  size?: number;
  color?: string;
}

export default function CloseX({ size = 14, color = "#424242" }: CloseXProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <Path
        d="M1.10859 14L0 12.8914L5.89141 7L0 1.10859L1.10859 0L7 5.89141L12.8914 0L14 1.10859L8.10859 7L14 12.8914L12.8914 14L7 8.10859L1.10859 14Z"
        fill={color}
      />
    </Svg>
  );
}
