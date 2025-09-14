import { useState } from "react";

import { LayoutChangeEvent } from "react-native";
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function useWithDrawForm(defaultOpen = false, duration = 200) {
  const [contentHeight, setContentHeight] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [otherReason, setOtherReason] = useState("");
  const isOpen = useSharedValue(defaultOpen ? 1 : 0);

  const toggle = () => {
    isOpen.value = withTiming(isOpen.value === 0 ? 1 : 0, {
      duration,
      easing: Easing.ease,
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    height: contentHeight > 0 ? isOpen.value * contentHeight : 0,
    overflow: "hidden",
  }));

  const onLayoutContent = (e: LayoutChangeEvent) => {
    setContentHeight(e.nativeEvent.layout.height);
  };

  const animatedArrowRotation = useAnimatedStyle(() => {
    const rotation = isOpen.value * 180;
    return {
      transform: [{ rotate: `${rotation}deg` }],
    };
  });

  const checkSubmit = () => {
    if (selected === null) return false;
    if (selected === "기타") {
      return otherReason.length > 0;
    } else {
      return true;
    }
  };

  return {
    toggle,
    selected,
    setSelected,
    animatedArrowRotation,
    animatedStyle,
    onLayoutContent,
    setOtherReason,
    otherReason,
    checkSubmit,
  };
}
