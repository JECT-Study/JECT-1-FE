import React from "react";

import { Text, TouchableOpacity } from "react-native";

interface StoryExampleProps {
  label: string;
  onPress: () => void;
}

export const StoryExample: React.FC<StoryExampleProps> = ({
  label,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="rounded-lg bg-blue-500 px-4 py-2 active:bg-blue-600"
    >
      <Text className="text-center font-medium text-white">{label}</Text>
    </TouchableOpacity>
  );
};

export default StoryExample;
