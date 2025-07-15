import { Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function DetailScreen() {
  const { id } = useLocalSearchParams();

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerShadowVisible: false,
        }}
      />
      <ThemedView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center px-4">
          <ThemedText type="subtitle" className="text-center text-gray-600">
            ID: {id}
          </ThemedText>
        </View>
      </ThemedView>
    </>
  );
}
