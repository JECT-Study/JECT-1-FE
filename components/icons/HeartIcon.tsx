import Svg, { Path } from "react-native-svg";

export default function HeartIcon({
  size,
  fill = "none",
  isFill = false,
  stroke = "#333333",
}: {
  size: number;
  fill?: string;
  isFill?: boolean;
  stroke?: string;
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 25 24"
      fill={isFill ? fill : "none"}
    >
      <Path
        d="M12.5 20L4.96368 12.9671C3.01211 11.1449 3.01211 8.18884 4.96368 6.36664C6.91526 4.54445 10.0842 4.54445 12.0358 6.36664L12.5 6.79903L12.9642 6.36664C14.9158 4.54445 18.0847 4.54445 20.0363 6.36664C21.9879 8.18884 21.9879 11.1449 20.0363 12.9671L12.5 20Z"
        stroke={stroke}
        stroke-width="1.6"
        stroke-miterlimit="10"
        stroke-linejoin="round"
      />
    </Svg>
  );
}
