import { useEffect, useRef } from "react";

import { Animated, View } from "react-native";

export default function Percentage({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const percentage = (current / total) * 100;
  const prevPercentage = ((current - 1) / total) * 100;
  const animatedValue = useRef(new Animated.Value(prevPercentage)).current;
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: percentage,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [percentage]);

  return (
    <View className="h-[4px] w-full bg-[#EEEEEE]">
      <Animated.View
        className="h-[4px] bg-[#816BFF]"
        style={{
          width: animatedValue.interpolate({
            inputRange: [0, 100],
            outputRange: ["0%", "100%"],
          }),
        }}
      ></Animated.View>
    </View>
  );
}
