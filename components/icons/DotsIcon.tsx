import React from "react";
import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface DotsIconProps {
  size?: number;
  color?: string;
}

export default function DotsIcon({ size = 4, color = "#424242" }: DotsIconProps) {
  return (
    <View style={{ width: size, height: size * 3 + 8 }}>
      <Svg width={size} height={size * 3 + 8} viewBox="0 0 4 16" fill="none">
        <Circle cx="2" cy="2" r="1.5" fill={color} />
        <Circle cx="2" cy="8" r="1.5" fill={color} />
        <Circle cx="2" cy="14" r="1.5" fill={color} />
      </Svg>
    </View>
  );
}