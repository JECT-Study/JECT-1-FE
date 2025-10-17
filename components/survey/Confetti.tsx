import { useEffect, useRef } from "react";

import { Dimensions, View } from "react-native";
import { ConfettiMethods, PIConfetti } from "react-native-fast-confetti";

const confettiColors = ["#A864FD", "#29CDFF", "#78FF44", "#FF718D"];

export default function Confetti() {
  const ref1 = useRef<ConfettiMethods>(null);
  const ref2 = useRef<ConfettiMethods>(null);
  const ref3 = useRef<ConfettiMethods>(null);

  const handleTouch = () => {
    // 터치 시 순차적으로 confetti 발생
    setTimeout(() => ref1.current?.restart(), 0);
    setTimeout(() => ref2.current?.restart(), 100);
    setTimeout(() => ref3.current?.restart(), 200);
  };

  useEffect(() => {
    // 마운트 시 순차적으로 여러 위치에서 confetti 발생
    setTimeout(() => ref1.current?.restart(), 0);
    setTimeout(() => ref2.current?.restart(), 250);
    setTimeout(() => ref3.current?.restart(), 500);
  }, []);

  const { width, height } = Dimensions.get("window");

  // 3개의 다른 위치 정의 (간격을 넓게)
  const positions = [
    { x: width * 0.2, y: height * 0.3 }, // 좌측
    { x: width * 0.5, y: height * 0.35 }, // 중앙
    { x: width * 0.8, y: height * 0.3 }, // 우측
  ];

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
        pointerEvents: "none",
      }}
    >
      <PIConfetti
        ref={ref1}
        colors={confettiColors}
        blastDuration={150}
        fallDuration={2000}
        fadeOutOnEnd
        sizeVariation={0.9}
        blastPosition={positions[0]}
        height={positions[0].y}
      />
      <PIConfetti
        ref={ref2}
        colors={confettiColors}
        blastDuration={150}
        fallDuration={2000}
        fadeOutOnEnd
        sizeVariation={0.9}
        blastPosition={positions[1]}
        height={positions[1].y}
      />
      <PIConfetti
        ref={ref3}
        colors={confettiColors}
        blastDuration={150}
        fallDuration={2000}
        fadeOutOnEnd
        sizeVariation={0.9}
        blastPosition={positions[2]}
        height={positions[2].y}
      />
    </View>
  );
}
