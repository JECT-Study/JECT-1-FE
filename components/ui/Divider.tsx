import React from "react";

import { View, ViewProps } from "react-native";

interface DividerProps extends ViewProps {
  height?: string;
  bg?: string;
  className?: string;
}

export default function Divider({
  height = "h-px",
  bg = "bg-[#F0F0F0]",
  className = "",
  ...restProps
}: DividerProps) {
  return (
    <View
      className={`w-full ${height} ${bg} ${className}`.trim()}
      {...restProps}
    />
  );
}
