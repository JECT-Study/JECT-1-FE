import React from "react";

import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Stop,
} from "react-native-svg";

interface LogoIconProps {
  width?: number;
  height?: number;
}

export const LogoIcon: React.FC<LogoIconProps> = ({
  width = 35,
  height = 33,
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 35 33" fill="none">
      <Defs>
        <LinearGradient
          id="paint0_linear"
          x1="4.27359"
          y1="1.81953"
          x2="4.74"
          y2="31.7668"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="white" />
          <Stop offset="1" stopColor="white" />
        </LinearGradient>
        <LinearGradient
          id="paint1_linear"
          x1="28.8201"
          y1="2"
          x2="33.1792"
          y2="8"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#6B51FB" />
          <Stop offset="1" stopColor="#AB9DFA" />
        </LinearGradient>
      </Defs>
      <Path
        d="M1.70374 1.09379C3.43605 -0.084561 5.7958 0.364452 6.97424 2.09672L20.361 21.7754C21.5391 23.5077 21.0902 25.8675 19.358 27.0459C17.6258 28.2243 15.266 27.7751 14.0875 26.043L7.24377 15.9825V28.9414C7.24377 30.9418 5.62207 32.5635 3.6217 32.5635C1.62147 32.5634 -0.000366211 30.9417 -0.000366211 28.9414V4.4932C-0.000361285 4.24677 0.0249959 4.00609 0.0718994 3.77348C0.199536 2.72476 0.761612 1.73469 1.70374 1.09379Z"
        fill="url(#paint0_linear)"
      />
      <Path
        d="M33.1547 1.37139C31.3754 0.193353 28.9425 0.656473 27.7201 2.40557L14.1078 21.886C12.8854 23.6355 13.3372 26.0093 15.1166 27.1878C16.8959 28.3659 19.3287 27.9028 20.5511 26.1536L27.559 16.1243V28.8431C27.559 30.8977 29.225 32.5638 31.2797 32.5638C33.3343 32.5637 35.0003 30.8977 35.0004 28.8431V4.59111C35.0002 3.24582 34.286 2.06672 33.2162 1.41338C33.1959 1.39941 33.1753 1.38504 33.1547 1.37139Z"
        fill="white"
      />
      <Circle cx="30.9996" cy="5" r="3" fill="url(#paint1_linear)" />
    </Svg>
  );
};
