import React from "react";

import Svg, { Path, SvgProps } from "react-native-svg";

interface ChevronRightProps extends SvgProps {
  width?: number;
  height?: number;
  color?: string;
}

export default function ChevronRight({
  width = 10,
  height = 10,
  color = "#6C4DFF",
  ...props
}: ChevronRightProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 10 10"
      fill="none"
      {...props}
    >
      <Path
        d="M0.5 0.5L5.5 5L0.500001 9.5"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
