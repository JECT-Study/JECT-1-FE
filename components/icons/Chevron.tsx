import Svg, { Path } from "react-native-svg";

type Props = {
  direction: "left" | "right";
  color?: string;
};

export default function Chevron({
  direction = "left",
  color = "#222222",
}: Props) {
  const pathD = {
    left: "M16 20L8 12L16 4",
    right: "M8 4l8 8-8 8",
  };
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d={pathD[direction]}
        stroke={color}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
}
