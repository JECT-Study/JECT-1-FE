import { useCallback, useEffect, useState } from "react";

import { AxiosError } from "axios";
import { router } from "expo-router";
import {
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  Text,
  View,
} from "react-native";

import FavoriteContentItem from "@/components/like/FavoriteContentItem";
import CustomHeader from "@/components/ui/CustomHeader";
import { UsersFavoriteUrl } from "@/constants/ApiUrls";
import { categoryUnion, filterData } from "@/constants/Filter";
import { authApi } from "@/features/axios/axiosInstance";

// 좋아요 아이템 타입 정의
interface FavoriteItem {
  contentId: number;
  likeId: number;
  title: string;
  image: string | null;
  address: string;
  startDate: string;
  endDate: string;
}

// 카테고리 매핑 함수 (contentType 파라미터용)
const getCategoryParam = (category: categoryUnion) => {
  const categoryMap: Record<categoryUnion, string> = {
    all: "",
    festival: "FESTIVAL",
    event: "EVENT",
    concert: "PERFORMANCE",
    exhibition: "EXHIBITION",
  };
  return category === "all" ? undefined : categoryMap[category];
};

export default function Like() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] =
    useState<categoryUnion>("all");

  // 좋아요 데이터 가져오기 함수
  const fetchLikes = useCallback(
    async (pageNumber: number, isLoadMore: boolean = false) => {
      setLoading(true);
      try {
        const categoryParam = getCategoryParam(selectedCategory);
        const params: any = {
          page: pageNumber,
          limit: 10,
        };
        if (categoryParam) {
          params.contentType = categoryParam;
        }

        const response = await authApi.get(UsersFavoriteUrl, {
          params,
        });

        const { content, last, totalElements } = response.data.result;

        if (isLoadMore) {
          setFavorites((prev) => [...prev, ...content]);
          setPage(pageNumber);
        } else {
          setFavorites(content);
          setPage(0);
        }

        setHasMore(!last && (isLoadMore ? true : totalElements > 0));
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("좋아요 데이터 로딩 실패:", axiosError);
      } finally {
        setLoading(false);
      }
    },
    [selectedCategory],
  );

  // 더 많은 데이터 로드
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    await fetchLikes(page + 1, true);
  }, [loading, hasMore, page, fetchLikes]);

  // 새로고침 함수
  const onRefresh = useCallback(async () => {
    setRefresh(true);
    try {
      await fetchLikes(0, false);
    } catch (error) {
      console.error("새로고침 실패:", error);
    } finally {
      setRefresh(false);
    }
  }, [fetchLikes]);

  // 카테고리 변경 시 데이터 새로고침
  useEffect(() => {
    fetchLikes(0, false);
  }, [selectedCategory, fetchLikes]);

  // 카테고리 변경 핸들러
  const handleCategoryChange = useCallback((category: categoryUnion) => {
    setSelectedCategory(category);
    setPage(0);
    setHasMore(true);
  }, []);

  // 좋아요 상태 변경 핸들러
  const handleLikeChange = useCallback(
    (contentId: number, isLiked: boolean, likeCount: number) => {
      // 좋아요가 취소된 경우 리스트에서 제거하거나 전체 새로고침
      if (!isLiked) {
        // 찜 목록에서 좋아요를 취소하면 해당 항목이 사라져야 하므로 새로고침
        fetchLikes(0, false);
      }
    },
    [fetchLikes],
  );

  return (
    <SafeAreaView className="w-full flex-1 items-center bg-white">
      <CustomHeader
        title="관심 목록"
        isCommit={false}
        separator
        cancel={() => {
          router.back();
        }}
      />
      <View className="flex w-full items-start p-6">
        {/* 카테고리 필터 */}
        <View className="flex flex-row gap-[10px]">
          {Object.entries(filterData).map(([key, value]) => {
            const categoryKey = key as categoryUnion;
            return (
              <Pressable
                onPress={() => handleCategoryChange(categoryKey)}
                key={key}
                className={`flex h-[33px] w-[49px] items-center justify-center rounded-[20px] text-[14px] ${
                  selectedCategory === key
                    ? "bg-[#6C4DFF] text-white"
                    : "border-[1px] border-[#6C4DFF] bg-white"
                } `}
              >
                <Text
                  className={`${
                    selectedCategory === key ? "text-white" : "text-[#6C4DFF]"
                  }`}
                >
                  {value}
                </Text>
              </Pressable>
            );
          })}
        </View>
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
          renderItem={({ item, index }) => (
            <FavoriteContentItem
              info={{
                contentId: item.contentId,
                title: item.title,
                address: item.address,
                start_date: item.startDate,
                end_date: item.endDate,
                img_url: item.image || undefined,
                likeId: item.likeId,
              }}
              onLikeChange={handleLikeChange}
              showSeparator={index < favorites.length - 1}
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
