import { router } from "expo-router";
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  View,
  Text,
} from "react-native";

import LikeFilter from "@/components/mypage/LikeFilter";
import CustomHeader from "@/components/ui/CustomHeader";
import PostBlock from "@/components/ui/PostBlock";
import { useLike } from "@/hooks/useLike";
import useLikeRefresh from "@/hooks/useLikeRefresh";
import { useCategorySelected } from "@/stores/useCategoryStore";

export default function Like() {
  const { refresh, onRefresh } = useLikeRefresh();
  const selected = useCategorySelected();
  const { favorites, loading, loadMore } = useLike(selected);

  return (
    <SafeAreaView className="w-full flex-1 items-center bg-white">
      <CustomHeader
        title="관심 목록"
        isCommit={false}
        cancel={() => {
          router.replace("/my");
        }}
      />
      <View className="flex w-full items-start p-6">
        <LikeFilter />
      </View>
      {favorites.length === 0 && !loading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-base text-gray-500">
            일치하는 내용이 없습니다.
          </Text>
        </View>
      ) : (
        <FlatList
          className="w-full flex-1 px-6 py-2"
          data={favorites}
          renderItem={({ item }) => (
            <PostBlock
              info={{
                img_url: item.image || "",
                title: item.title,
                address: item.address,
                start_date: item.startDate,
                end_date: item.endDate,
              }}
            />
          )}
          keyExtractor={(item) => item.contentId.toString()}
          onEndReached={loadMore}
          onEndReachedThreshold={0.8}
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
}
