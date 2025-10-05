import { useEffect, useRef, useState } from "react";

import { Dimensions, GestureResponderEvent, View } from "react-native";
import { ConfettiMethods, PIConfetti } from "react-native-fast-confetti";

const confettiColors = ["#A864FD", "#29CDFF", "#78FF44", "#FF718D"];

export default function Confetti() {
  const [position, setPosition] = useState({ x: -999, y: -999 });
  const ref = useRef<ConfettiMethods>(null);

  const handleTouch = (e: GestureResponderEvent) => {
    const { locationX, locationY } = e.nativeEvent;
    setPosition({ x: locationX, y: locationY });
    ref.current?.restart();
  };
  useEffect(() => {
    const { width, height } = Dimensions.get("window");
    const centerX = width / 2;
    const centerY = height / 2;
    setPosition({ x: centerX, y: centerY });
    ref.current?.restart();
  }, []);

  return (
    <View
      onTouchStart={handleTouch}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
        pointerEvents: "box-only",
      }}
    >
      <PIConfetti
        ref={ref}
        colors={confettiColors}
        blastDuration={150}
        fallDuration={1500}
        fadeOutOnEnd
        sizeVariation={0.9}
        blastPosition={position}
        height={position.y}
      />
    </View>
  );
}
