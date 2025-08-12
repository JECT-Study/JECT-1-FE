import React from "react";

import Svg, { Path } from "react-native-svg";

type Props = {
  direction: "left" | "right";
  color?: string;
  width?: number;
  height?: number;
};

export default function CalendarArrow({
  direction = "right",
  color = "#424242",
  width = 7,
  height = 12,
}: Props) {
  const pathD =
    direction === "left"
      ? "M5.5 10.727L0.77273 5.99974L5.5 1.27246"
      : "M1.5 1.27246L6.22727 5.99974L1.5 10.727";

  return (
    <Svg width={width} height={height} viewBox="0 0 7 12" fill="none">
      <Path
        d={pathD}
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
