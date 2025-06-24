import { LinearGradient } from "expo-linear-gradient";
import {
  FlatList,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

const SkeletonCard = () => (
  <View className="mr-4">
    <View className="mb-2 h-32 w-40 rounded-lg bg-gray-400" />
    <View className="w-30 mb-1 h-3 rounded bg-gray-300" />
    <View className="h-3 w-20 rounded bg-gray-300" />
  </View>
);

export default function HomeScreen() {
  const skeletonData = Array.from({ length: 8 }, (_, i) => ({
    id: i.toString(),
  }));
  const categoryData = Array.from({ length: 4 }, (_, i) => ({
    id: i.toString(),
  }));

  return (
    <ScrollView className="flex-1 bg-white">
      <LinearGradient
        colors={["#816BFF", "#705EDB"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.1 }}
        locations={[0.0683, 0.9503]}
      >
        <View className="pb-6 pt-1">
          <View className="mb-1 items-center">
            <View className="rounded bg-white px-4 py-2">
              <ThemedText className="font-medium text-black">로고</ThemedText>
            </View>
          </View>

          <TextInput
            className="mx-4 my-3 h-11 rounded-full bg-white px-4 py-3"
            placeholder="검색창"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </LinearGradient>

      <ThemedView className="-mt-6 flex-1 rounded-t-3xl px-4 pb-10 pt-6">
        <View className="mb-6">
          <View className="flex-row items-center justify-center gap-6">
            {categoryData.map((item) => (
              <View
                key={item.id}
                className="mr-2 h-16 w-16 rounded-2xl bg-gray-300"
              />
            ))}
          </View>
        </View>

        <View className="flex-1 gap-y-8">
          <ThemedView>
            <View className="mb-3 flex-row items-center justify-between">
              <ThemedText type="subtitle" className="font-bold text-black">
                맞춤 컨텐츠
              </ThemedText>
            </View>

            <View className="mb-3">
              <FlatList
                data={skeletonData}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={() => (
                  <View className="mr-2 h-8 w-16 rounded-full bg-gray-300" />
                )}
                keyExtractor={(item) => item.id}
              />
            </View>

            <FlatList
              data={skeletonData}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={() => <SkeletonCard />}
              keyExtractor={(item) => item.id}
            />
          </ThemedView>

          <ThemedView>
            <View className="mb-3 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <ThemedText type="subtitle" className="font-bold text-black">
                  MD픽 추천 컨텐츠
                </ThemedText>
                <ThemedText className="ml-1 text-orange-500">🔥</ThemedText>
              </View>
              <TouchableOpacity>
                <ThemedText className="text-sm text-gray-500">
                  더보기
                </ThemedText>
              </TouchableOpacity>
            </View>

            <FlatList
              data={skeletonData}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={() => <SkeletonCard />}
              keyExtractor={(item) => item.id}
            />
          </ThemedView>

          <ThemedView>
            <View className="mb-3 flex-row items-center justify-between">
              <ThemedText type="subtitle" className="font-bold text-black">
                이런 축제 어때요?
              </ThemedText>
              <TouchableOpacity>
                <ThemedText className="text-sm text-gray-500">
                  더보기
                </ThemedText>
              </TouchableOpacity>
            </View>

            <FlatList
              data={skeletonData}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={() => <SkeletonCard />}
              keyExtractor={(item) => item.id}
            />
          </ThemedView>
        </View>
      </ThemedView>
    </ScrollView>
  );
}
