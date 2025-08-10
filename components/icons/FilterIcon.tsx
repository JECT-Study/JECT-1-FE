import React from "react";

import Svg, { Circle, Path } from "react-native-svg";

type Props = {
  size?: number;
  color?: string;
};

export default function FilterIcon({ size = 19, color = "#424242" }: Props) {
  const height = (size * 14) / 19; // 원본 비율 유지 (19:14)

  return (
    <Svg width={size} height={height} viewBox="0 0 19 14" fill="none">
      <Path d="M1 2H3.5" stroke={color} strokeLinecap="round" />
      <Path d="M1 7H3.5" stroke={color} strokeLinecap="round" />
      <Path d="M1 12H3.5" stroke={color} strokeLinecap="round" />
      <Path d="M7.5 2H18.5" stroke={color} strokeLinecap="round" />
      <Path d="M1.5 7L18.5 7" stroke={color} strokeLinecap="round" />
      <Path d="M7.5 12H18.5" stroke={color} strokeLinecap="round" />
      <Circle cx="5.5" cy="2" r="1.5" fill="white" stroke={color} />
      <Circle cx="14.5" cy="7" r="1.5" fill="white" stroke={color} />
      <Circle cx="5.5" cy="12" r="1.5" fill="white" stroke={color} />
    </Svg>
  );
}
