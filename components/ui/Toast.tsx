import { useCallback, useEffect, useState } from "react";

import { Animated, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CheckmarkIcon from "@/components/icons/CheckmarkIcon";

interface ToastProps {
  visible: boolean;
  message: string;
  duration?: number;
  onHide: () => void;
}

export default function Toast({
  visible,
  message,
  duration = 3000,
  onHide,
}: ToastProps) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(100));

  const insets = useSafeAreaInsets();

  const showToast = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const hideToast = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  }, [fadeAnim, slideAnim, onHide]);

  useEffect(() => {
    if (visible) {
      showToast();
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, showToast, hideToast, duration]);

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      className="absolute left-4 right-4 z-50"
      style={{
        bottom: 80 + insets.bottom,
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <Pressable onPress={hideToast}>
        <View className="flex-row items-center rounded-lg bg-[#424242] px-4 py-3 shadow-lg">
          {/* Blue checkmark icon */}
          <View className="mr-3 h-6 w-6 items-center justify-center rounded-full bg-[##007AFF]">
            <CheckmarkIcon size={10} color="white" />
          </View>
          <Text className="flex-1 text-lg text-white">{message}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}
