import React from "react";

import Svg, { Path } from "react-native-svg";

interface NewChevronRightProps {
  width?: number;
  height?: number;
  color?: string;
}

export default function NewChevronRight({
  width = 16,
  height = 17,
  color = "#212121",
}: NewChevronRightProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 16 17" fill="none">
      <Path
        d="M5.33341 3.16683L10.6667 8.50016L5.33342 13.8335"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}