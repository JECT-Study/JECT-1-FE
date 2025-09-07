import React from "react";

import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";

interface FestivalIconProps {
  width?: number;
  height?: number;
}

export const FestivalIcon: React.FC<FestivalIconProps> = ({
  width = 39,
  height = 45,
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 39 45" fill="none">
      <Path
        d="M0.124035 42.5887L11.3354 14.5763L31.7432 33.469L2.45227 44.8752C2.12774 45.0024 1.77259 45.0332 1.43052 44.9639C1.08846 44.8946 0.774403 44.7282 0.526999 44.4853C0.279596 44.2423 0.10964 43.9333 0.0380446 43.5963C-0.0335506 43.2594 -0.00366103 42.9091 0.124035 42.5887Z"
        fill="url(#paint0_linear_1886_2209)"
      />
      <Path
        d="M3.45239 13.358L1.22266 15.5651L3.45239 17.7634L5.69107 15.5651L3.45239 13.358Z"
        fill="#FA9ED3"
      />
      <Path
        d="M35.7729 37.53L33.5342 39.7371L35.7729 41.9442L38.0115 39.7371L35.7729 37.53Z"
        fill="#F1EC94"
      />
      <Path
        d="M31.8933 33.3028C33.2319 31.8801 29.7171 26.5199 24.0428 21.3305C18.3684 16.1411 12.6833 13.0876 11.3447 14.5103C10.006 15.933 13.5208 21.2931 19.1952 26.4825C24.8695 31.6719 30.5546 34.7255 31.8933 33.3028Z"
        fill="url(#paint1_linear_1886_2209)"
      />
      <Path
        d="M27.5461 28L26 26.8507C26.7499 25.5844 27.8484 24.6109 29.1371 24.0707C31.2135 23.3929 32.0315 25.4558 33.9011 25.112C34.4323 25.0242 34.9322 24.7818 35.3481 24.4102C35.7641 24.0386 36.0808 23.5515 36.2652 23L38 24.2868C37.7102 25.0313 37.2508 25.6822 36.6654 26.1775C36.08 26.6727 35.3883 26.9958 34.6562 27.1159C31.8517 27.833 30.9978 25.8389 29.4876 26.1336C29.0438 26.2342 28.6314 26.4591 28.2911 26.7863C27.9507 27.1135 27.694 27.5317 27.5461 28Z"
        fill="#9286FF"
      />
      <Path
        d="M25.1615 18.1076V16.0153C25.7669 16.0664 26.3759 15.9745 26.938 15.7473C27.5002 15.5201 27.9994 15.1641 28.3942 14.7087C29.3775 13.7251 29.966 12.4235 30.0508 11.045H32.3253C32.1087 12.8943 31.3138 14.6314 30.0508 16.0153C28.7292 17.2696 26.9934 18.0124 25.1615 18.1076Z"
        fill="url(#paint2_linear_1886_2209)"
      />
      <Path
        d="M8.4609 21.7096C8.4609 21.7096 9.64291 26.7595 14.3262 31.3502C19.5648 36.453 23.684 36.5854 23.684 36.5854L16.3411 39.4458C16.3411 39.4458 13.555 38.6108 9.99998 35C6.44495 31.3892 5.77448 28.481 5.77448 28.481L8.4609 21.7096Z"
        fill="url(#paint3_linear_1886_2209)"
      />
      <Path
        d="M4.24324 32.2772C4.43436 34.4192 5.38563 36.4262 6.92966 37.945C8.42031 39.552 10.4297 40.6002 12.6159 40.9113L8.56838 42.5004C8.56838 42.5004 6.47297 42.9683 4.1716 40.4169C1.87024 37.8655 2.67616 36.2323 2.67616 36.2323L4.24324 32.2772Z"
        fill="url(#paint4_linear_1886_2209)"
      />
      <Path
        d="M29.8085 0.893768L27.5699 3.10086L29.8085 5.30794L32.0472 3.10086L29.8085 0.893768Z"
        fill="#32D0FC"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_1886_2209"
          x1="10.422"
          y1="24.7819"
          x2="18.2846"
          y2="45.1806"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#9781FF" />
          <Stop offset="1" stopColor="#6443FF" />
        </LinearGradient>
        <LinearGradient
          id="paint1_linear_1886_2209"
          x1="21.522"
          y1="28.6828"
          x2="21.6942"
          y2="20.3552"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#8770F2" />
          <Stop offset="1" stopColor="#5435E7" />
        </LinearGradient>
        <LinearGradient
          id="paint2_linear_1886_2209"
          x1="28.7434"
          y1="11.045"
          x2="28.7434"
          y2="18.1076"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#A7E0FF" />
          <Stop offset="1" stopColor="#3CBBFF" />
        </LinearGradient>
        <LinearGradient
          id="paint3_linear_1886_2209"
          x1="7.71859"
          y1="26.8107"
          x2="18.3656"
          y2="38.791"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0.437496" stopColor="#DBF4FF" />
          <Stop offset="1" stopColor="#80D8FF" />
        </LinearGradient>
        <LinearGradient
          id="paint4_linear_1886_2209"
          x1="3.30723"
          y1="35.082"
          x2="10.5759"
          y2="42.1475"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0.468694" stopColor="#DBF5FF" />
          <Stop offset="1" stopColor="#87DBFF" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
};

export default FestivalIcon;
