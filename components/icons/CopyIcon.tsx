import Svg, { Path, Rect } from "react-native-svg";

export default function CopyIcon() {
  return (
    <Svg width="16" height="17" viewBox="0 0 16 17" fill="none">
      <Rect
        x="2.66602"
        y="3.16602"
        width="8"
        height="8"
        stroke="#186ADE"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <Path
        d="M13.3333 6.5V13.8333H6"
        stroke="#186ADE"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
