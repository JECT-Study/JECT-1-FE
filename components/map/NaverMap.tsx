import { JSX } from "react";

import { Platform } from "react-native";

// 타입 명시가 있으면 더 안전
type NaverMapComponent = (props: { mapKey: number }) => JSX.Element;

const loader = Platform.select<() => NaverMapComponent>({
  native: () => require("./NaverMap.native").default,
  web: () => require("./NaverMap.web").default,
});

const NaverMap = loader ? loader() : () => null; // 함수 그대로 export

export default NaverMap;
