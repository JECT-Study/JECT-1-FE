import { ScrollView } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function SearchScreen() {
  return (
    <ScrollView className="flex-1 p-4">
      <ThemedView className="mb-4 pt-10">
        <ThemedText type="title">검색</ThemedText>
      </ThemedView>
    </ScrollView>
  );
}
