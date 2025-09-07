import React from "react";
import { View } from "react-native";
import Svg, { Circle, Mask, G, Rect, Path, Ellipse } from "react-native-svg";

interface DefaultProfileIconProps {
  size?: number;
}

export default function DefaultProfileIcon({ size = 70 }: DefaultProfileIconProps) {
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 70 70" fill="none">
        <Circle 
          cx="35" 
          cy="35" 
          r="34.25" 
          fill="#EFEFEF" 
          stroke="#D3D1DD" 
          strokeWidth="0.5"
        />
        <Mask 
          id="mask0_789_3314" 
          maskType="alpha" 
          maskUnits="userSpaceOnUse" 
          x="1" 
          y="1" 
          width="68" 
          height="68"
        >
          <Circle cx="35" cy="35" r="34" fill="#F9F9F9"/>
        </Mask>
        <G mask="url(#mask0_789_3314)">
          <Circle cx="35" cy="35" r="18" fill="#F9F9F9"/>
          <Rect x="29.5" y="31" width="2" height="4" rx="1" fill="#DDE0E4"/>
          <Rect x="38.5" y="31" width="2" height="4" rx="1" fill="#DDE0E4"/>
          <Path 
            d="M39.8096 39.0811C39.8096 40.9733 37.6565 42.5073 35.0005 42.5073C32.3445 42.5073 30.1914 40.9733 30.1914 39.0811" 
            stroke="#DDE0E4" 
            strokeWidth="1.6" 
            strokeLinecap="round"
          />
          <Ellipse cx="35" cy="66" rx="23" ry="18" fill="#F9F9F9"/>
        </G>
      </Svg>
    </View>
  );
}