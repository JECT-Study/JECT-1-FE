import React from "react";

import Svg, { Path } from "react-native-svg";

interface SearchIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export const SearchIcon: React.FC<SearchIconProps> = ({
  width = 20,
  height = 21,
  color = "#6C4DFF",
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 21" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.29415 15.4735C4.60331 15.4735 1.60185 12.4724 1.60185 8.78208C1.60185 5.09173 4.60331 2.09067 8.29415 2.09067C11.985 2.09067 14.9864 5.09173 14.9864 8.78208C14.9864 12.4724 11.985 15.4735 8.29415 15.4735ZM19.7697 19.1426L14.6789 14.0525C15.8561 12.6209 16.5667 10.7863 16.5667 8.78208C16.5667 4.21156 12.8653 0.5 8.28354 0.5C3.70181 0.5 0.000366211 4.20095 0.000366211 8.78208C0.000366211 13.3632 3.70181 17.0642 8.28354 17.0642C10.2881 17.0642 12.1229 16.3537 13.5547 15.1766L18.6455 20.2667C18.8046 20.4258 19.0061 20.5 19.2076 20.5C19.4091 20.5 19.6106 20.4258 19.7697 20.2667C20.0773 19.9592 20.0773 19.4502 19.7697 19.1426Z"
        fill={color}
      />
    </Svg>
  );
};

// 기존 코드와의 호환성을 위한 default export
export default SearchIcon;
