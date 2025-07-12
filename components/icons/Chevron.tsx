import Svg, { Path } from "react-native-svg";

type Props = {
  direction: "left" | "right";
  color?: string;
};

export default function Chevron({ direction, color = "#6D6D6D" }: Props) {
  const pathData = direction === "left" ? "M5 1L1 5L5 9" : "M1 1L5 5L1 9";

  return (
    <Svg width="6" height="10" viewBox="0 0 6 10" fill="none">
      <Path
        d={pathData}
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
