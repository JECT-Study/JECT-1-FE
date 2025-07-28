import React from "react";

import Svg, { Circle, Ellipse, Path } from "react-native-svg";

interface LocationMarkerIconProps {
  width?: number;
  height?: number;
}

export default function LocationMarkerIcon({
  width = 19,
  height = 21,
}: LocationMarkerIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 19 21" fill="none">
      <Ellipse cx="9" cy="19" rx="3.5" ry="1" fill="#B5B5B5" opacity="0.5" />
      <Path
        d="M3.34315 3.29725C6.46734 0.234249 11.5327 0.234249 14.6569 3.29725C17.781 6.36026 17.781 11.3264 14.6569 14.3894L13.5663 15.4468C12.7625 16.2203 11.7196 17.2146 10.4371 18.4303C9.63571 19.19 8.36429 19.1899 7.56302 18.4301L4.35551 15.3712C3.95239 14.9831 3.61495 14.6559 3.34315 14.3894C0.218952 11.3264 0.218952 6.36026 3.34315 3.29725Z"
        fill="#EE8B49"
      />
      <Path
        d="M3.90332 3.86816C6.71637 1.11045 11.2836 1.11045 14.0967 3.86816C16.9 6.61661 16.9011 11.0659 14.0996 13.8154L13.0117 14.8701C12.2099 15.6417 11.1684 16.6346 9.88672 17.8496C9.42471 18.2876 8.7033 18.315 8.20898 17.9316L8.11328 17.8496L4.90723 14.792C4.50656 14.4063 4.17208 14.0819 3.90332 13.8184C1.09904 11.069 1.09904 6.61752 3.90332 3.86816Z"
        stroke="#E65636"
        strokeWidth="1.6"
        fill="none"
      />
      <Circle cx="9" cy="8.5" r="2.5" fill="white" />
    </Svg>
  );
}
