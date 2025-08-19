import { useEffect, useRef, useState } from "react";

import {
  Dimensions,
  GestureResponderEvent,
  Platform,
  View,
} from "react-native";

const confettiColors = ["#A864FD", "#29CDFF", "#78FF44", "#FF718D"];

export default function Confetti() {
  const [position, setPosition] = useState({ x: -999, y: -999 });
  const ref = useRef<any>(null);
  const [PIConfetti, setPIConfetti] = useState<any>(null);

  // 네이티브용 confetti 처리
  useEffect(() => {
    if (Platform.OS === "web") return;

    const { width, height } = Dimensions.get("window");
    const centerX = width / 2;
    const centerY = height / 2;
    setPosition({ x: centerX, y: centerY });
    ref.current?.restart();
  }, []);

  // react-native-fast-confetti 동적 import
  useEffect(() => {
    if (Platform.OS === "web") return;

    import("react-native-fast-confetti").then((module) => {
      setPIConfetti(() => module.PIConfetti);
    });
  }, []);

  const handleTouch = (e: GestureResponderEvent) => {
    if (Platform.OS === "web") return;

    const { locationX, locationY } = e.nativeEvent;
    setPosition({ x: locationX, y: locationY });
    ref.current?.restart();
  };

  // 웹에서는 빈 View 반환
  if (Platform.OS === "web") {
    return <View />;
  }

  // 네이티브에서는 confetti 컴포넌트 반환
  if (!PIConfetti) {
    return <View />;
  }

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
