import React from "react";

import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

interface PhotoIconProps {
  size?: number;
  color?: string;
}

export default function PhotoIcon({
  size = 24,
  color = "#424242",
}: PhotoIconProps) {
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M15 10C15 11.1046 14.1046 12 13 12C11.8954 12 11 11.1046 11 10C11 8.89543 11.8954 8 13 8C14.1046 8 15 8.89543 15 10Z"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M4 16L8 12L13 17L16 14L20 18V6"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}
