import React from "react";

import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Rect,
  Stop,
  SvgProps,
} from "react-native-svg";

interface LockIconProps extends SvgProps {
  width?: number;
  height?: number;
}

export default function LockIcon({
  width = 63,
  height = 67,
  ...props
}: LockIconProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 63 67"
      fill="none"
      {...props}
    >
      <Defs>
        <LinearGradient
          id="paint0_linear"
          x1="31.8226"
          y1="1.5"
          x2="31.8226"
          y2="23.0526"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#6D7580" />
          <Stop offset="1" stopColor="#6D767D" />
        </LinearGradient>

        <LinearGradient
          id="paint1_linear"
          x1="5.28069"
          y1="21.0117"
          x2="61.3928"
          y2="70.306"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0.0240385" stopColor="#DEECFC" />
          <Stop offset="0.370967" stopColor="#DAE0E8" />
          <Stop offset="1" stopColor="#818588" />
        </LinearGradient>
      </Defs>

      <Path
        d="M31.4762 7.24735C20.6162 7.24735 19.7954 17.7842 20.7425 23.0526H14.7443C13.7972 15.8684 15.8177 1.5 31.4762 1.5C47.1346 1.5 49.6812 15.8684 48.9972 23.0526H43.3147C43.8935 17.7842 42.3361 7.24735 31.4762 7.24735Z"
        fill="url(#paint0_linear)"
      />
      <Rect
        x="2.23169"
        y="21.0117"
        width="58.5366"
        height="44.4878"
        rx="8"
        fill="url(#paint1_linear)"
      />
      <Path
        d="M27.9878 51.499V46.1299C27.9878 45.0253 28.8832 44.1299 29.9878 44.1299H32.1683C33.2729 44.1299 34.1683 45.0253 34.1683 46.1299V51.499C34.1683 53.2057 32.7848 54.5892 31.078 54.5892C29.3713 54.5892 27.9878 53.2057 27.9878 51.499Z"
        fill="#161C24"
      />
      <Circle cx="30.7294" cy="40.01" r="5.86356" fill="#161C24" />
    </Svg>
  );
}
