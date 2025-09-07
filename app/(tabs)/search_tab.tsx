import { useCallback, useState } from "react";

import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { setStatusBarStyle } from "expo-status-bar";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";

import Chevron from "@/components/icons/Chevron";
import FilterIcon from "@/components/icons/FilterIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import CategoryBottomSheet from "@/components/search/CategoryBottomSheet";
import RegionBottomSheet from "@/components/search/RegionBottomSheet";
import Divider from "@/components/ui/Divider";
import { BACKEND_URL } from "@/constants/ApiUrls";
import { authApi } from "@/features/axios/axiosInstance";
import {
  CategorySearchResponse,
  EventCardProps,
  SEARCH_LIMIT,
  SearchContentItem,
} from "@/types/search";
import { getImageSource } from "@/utils/imageUtils";
import {
  getCategoryLabel,
  getRegionKeyword,
  getRegionLabel,
} from "@/utils/searchUtils";

function EventCard({ item, onPress }: EventCardProps) {
  return (
    <Pressable
      className="mb-6 flex w-[48%] items-center"
      onPress={() => onPress(item.id)}
    >
      <View className="h-[208px] w-full overflow-hidden rounded-[11px] bg-gray-200">
        <Image
          source={getImageSource(item.id)}
          className="h-full w-full"
          resizeMode="cover"
        />
      </View>
      <View className="mt-3 w-full">
        <Text
          className="text-lg font-semibold leading-5 text-gray-800"
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text className="mt-1 text-sm text-gray-500" numberOfLines={1}>
          {item.address}
        </Text>
      </View>
    </Pressable>
  );
}

export default function SearchScreen() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false); // 무한스크롤로 추가 데이터를 불러오는 중인지 여부 (하단 로딩 인디케이터 표시용)

  const [selectedCategory, setSelectedCategory] = useState<string>("ALL"); // 선택된 카테고리 필터
  const [isCategoryFilterOpen, setIsCategoryFilterOpen] =
    useState<boolean>(false); // 카테고리 바텀시트 열림/닫힘 상태
  const [selectedRegion, setSelectedRegion] = useState<string>("ALL"); // 선택된 지역 필터
  const [isRegionFilterOpen, setIsRegionFilterOpen] = useState<boolean>(false); // 지역 바텀시트 열림/닫힘 상태

  const [filterSearchResults, setFilterSearchResults] = useState<
    SearchContentItem[]
  >([]);
  const [isFilterSearchMode, setIsFilterSearchMode] = useState<boolean>(false); // 필터 검색 모드 여부 (카테고리 또는 지역 필터 적용 시)
  const [filterSearchPage, setFilterSearchPage] = useState<number>(1); // 필터 검색 페이지
  const [filterHasMoreData, setFilterHasMoreData] = useState<boolean>(true); // 필터 검색 더 불러올 데이터 있는지

  // 탭 포커스 시 StatusBar 스타일 설정
  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle("dark");
    }, []),
  );

  // 통합 필터 검색 함수 (카테고리와 지역 교집합 검색)
  const searchByFilters = useCallback(
    async (
      category: string,
      region: string,
      page: number = 1,
      isLoadMore: boolean = false,
    ) => {
      try {
        if (isLoadMore) {
          setIsLoadingMore(true);
        } else {
          setIsLoading(true);
          setIsFilterSearchMode(true);
        }

        const regionKeyword = getRegionKeyword(region);

        // API 파라미터 구성
        const params: any = {
          keyword: "", // 빈 문자열로 검색
          page: page,
          size: SEARCH_LIMIT,
        };

        // 카테고리와 지역 필터 조건 추가
        if (category !== "ALL") {
          params.category = category;
        }

        if (region !== "ALL") {
          params.region = regionKeyword;
        }

        const response = await authApi.get<CategorySearchResponse>(
          `${BACKEND_URL}/search/results`,
          { params },
        );

        if (response.data.isSuccess && response.data.result) {
          const { contentList, pageInfo } = response.data.result;

          // CategorySearchItem을 SearchContentItem으로 변환
          const transformedResults: SearchContentItem[] = contentList.map(
            (item) => ({
              id: item.id,
              title: item.title,
              thumbnailUrl: item.thumbnailUrl || "",
              category: item.category,
              address: item.address,
              date: "", // 필터 검색에는 date 정보가 없음
              views: 0, // 필터 검색에는 views 정보가 없음
            }),
          );

          if (isLoadMore) {
            setFilterSearchResults((prev) => [...prev, ...transformedResults]);
          } else {
            setFilterSearchResults(transformedResults);
          }

          setFilterSearchPage(pageInfo.currentPage);
          setFilterHasMoreData(pageInfo.currentPage < pageInfo.totalPages);
        } else {
          if (!isLoadMore) {
            setFilterSearchResults([]);
          }
          setFilterHasMoreData(false);
        }
      } catch (error) {
        console.error("필터 검색 실패:", error);
        if (!isLoadMore) {
          setFilterSearchResults([]);
        }
        setFilterHasMoreData(false);
      } finally {
        if (isLoadMore) {
          setIsLoadingMore(false);
        } else {
          setIsLoading(false);
        }
      }
    },
    [],
  );

  const handleFilterOpen = useCallback(() => {
    setIsCategoryFilterOpen(true);
  }, []);

  const handleFilterClose = useCallback(() => {
    setIsCategoryFilterOpen(false);
  }, []);

  // 카테고리 선택 처리
  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  // 카테고리 바텀시트에서 검색 버튼 클릭 시
  const handleCategorySearchPress = useCallback(
    (category: string) => {
      setSelectedCategory(category);
      searchByFilters(category, selectedRegion, 1, false);
    },
    [selectedRegion, searchByFilters],
  );

  const handleRegionFilterOpen = useCallback(() => {
    setIsRegionFilterOpen(true);
  }, []);

  const handleRegionFilterClose = useCallback(() => {
    setIsRegionFilterOpen(false);
  }, []);

  // 지역 선택 처리
  const handleRegionSelect = useCallback((region: string) => {
    setSelectedRegion(region);
  }, []);

  // 지역 바텀시트에서 검색 버튼 클릭 시
  const handleRegionSearchPress = useCallback(
    (region: string) => {
      setSelectedRegion(region);
      searchByFilters(selectedCategory, region, 1, false);
    },
    [selectedCategory, searchByFilters],
  );

  // 무한스크롤 핸들러
  const handleLoadMore = useCallback(() => {
    if (isFilterSearchMode && filterHasMoreData && !isLoadingMore) {
      // 필터 검색 모드에서의 무한스크롤
      const nextPage = filterSearchPage + 1;
      searchByFilters(selectedCategory, selectedRegion, nextPage, true);
    }
  }, [
    isFilterSearchMode,
    filterHasMoreData,
    filterSearchPage,
    selectedCategory,
    selectedRegion,
    isLoadingMore,
    searchByFilters,
  ]);

  // 카드 클릭 핸들러
  const handleCardPress = useCallback(
    (id: number) => {
      // 바텀시트가 열려있으면 닫기
      if (isCategoryFilterOpen) {
        setIsCategoryFilterOpen(false);
      }
      if (isRegionFilterOpen) {
        setIsRegionFilterOpen(false);
      }
      router.push(`/detail/${id}`);
    },
    [isCategoryFilterOpen, isRegionFilterOpen],
  );

  // 이벤트 카드 렌더링 함수
  const renderEventCard = useCallback(
    ({ item }: { item: SearchContentItem }) => {
      return <EventCard item={item} onPress={handleCardPress} />;
    },
    [handleCardPress],
  );

  return (
    <View className="flex-1 bg-white pt-[65px]">
      <View className={`px-4 pb-4 ${Platform.OS === "web" ? "pt-10" : "pt-2"}`}>
        <View className="flex-row items-center rounded-full border-[1.2px] border-[#6C4DFF] bg-white px-4 py-3">
          <SearchIcon size={20} color="#6C4DFF" />
          <Pressable
            className="ml-3 flex-1"
            onPress={() =>
              router.push({
                pathname: "/search-keywords",
                params: {
                  category: selectedCategory,
                  region: selectedRegion,
                },
              })
            }
          >
            <Text className="text-[16px] text-[#9CA3AF]">
              이번 주말, 뭐할까?
            </Text>
          </Pressable>
        </View>
      </View>

      {/* 필터 영역 */}
      <View className="flex-row items-center px-4 pb-4">
        <View className="mr-4 flex-row items-center">
          <FilterIcon
            size={19}
            color={isRegionFilterOpen ? "#9CA3AF" : "#424242"}
          />
          <Text
            className={`ml-2 text-[14px] ${
              isRegionFilterOpen ? "text-[#9CA3AF]" : "text-[#424242]"
            }`}
          >
            필터
          </Text>
        </View>

        <Pressable
          className={`mr-3 flex-row items-center rounded-full px-3 py-2 ${
            isCategoryFilterOpen || selectedCategory !== "ALL"
              ? "border border-[#6C4DFF] bg-[#DFD8FD]"
              : isRegionFilterOpen
                ? "border border-[#E0E0E0] bg-gray-100"
                : "border border-[#E0E0E0] bg-white"
          } ${isRegionFilterOpen ? "opacity-50" : "opacity-100"}`}
          onPress={!isRegionFilterOpen ? handleFilterOpen : undefined}
          disabled={isRegionFilterOpen}
        >
          <Text
            className={`mr-1 text-[14px] ${
              isCategoryFilterOpen || selectedCategory !== "ALL"
                ? "text-[#6C4DFF]"
                : isRegionFilterOpen
                  ? "text-[#9CA3AF]"
                  : "text-[#424242]"
            }`}
          >
            {getCategoryLabel(selectedCategory)}
          </Text>
          <Chevron
            direction="down"
            size={12}
            color={
              isCategoryFilterOpen || selectedCategory !== "ALL"
                ? "#6C4DFF"
                : isRegionFilterOpen
                  ? "#9CA3AF"
                  : "#424242"
            }
          />
        </Pressable>

        <Pressable
          className={`flex-row items-center rounded-full px-3 py-2 ${
            isRegionFilterOpen || selectedRegion !== "ALL"
              ? "border border-[#6C4DFF] bg-[#DFD8FD]"
              : isCategoryFilterOpen
                ? "border border-[#E0E0E0] bg-gray-100"
                : "border border-[#E0E0E0] bg-white"
          } ${isCategoryFilterOpen ? "opacity-50" : "opacity-100"}`}
          onPress={!isCategoryFilterOpen ? handleRegionFilterOpen : undefined}
          disabled={isCategoryFilterOpen}
        >
          <Text
            className={`mr-1 text-[14px] ${
              isRegionFilterOpen || selectedRegion !== "ALL"
                ? "text-[#6C4DFF]"
                : isCategoryFilterOpen
                  ? "text-[#9CA3AF]"
                  : "text-[#424242]"
            }`}
          >
            {getRegionLabel(selectedRegion)}
          </Text>
          <Chevron
            direction="down"
            size={12}
            color={
              isRegionFilterOpen || selectedRegion !== "ALL"
                ? "#6C4DFF"
                : isCategoryFilterOpen
                  ? "#9CA3AF"
                  : "#424242"
            }
          />
        </Pressable>
      </View>

      <Divider />

      <FlatList
        className="pt-8"
        data={filterSearchResults}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 100,
        }}
        columnWrapperStyle={{
          justifyContent: "space-between",
        }}
        renderItem={renderEventCard}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          isLoading ? (
            <View className="flex-1 items-center justify-center py-20">
              <ActivityIndicator size="large" color="#6C4DFF" />
              <Text className="mt-4 text-center text-gray-500">
                {isFilterSearchMode ? "필터 검색 중..." : "검색 중..."}
              </Text>
            </View>
          ) : (
            <View className="flex-1 items-center justify-center py-20">
              {isFilterSearchMode ? (
                <Text className="text-center text-gray-500">
                  필터 검색 결과가 없습니다.
                </Text>
              ) : (
                <Text className="text-center text-gray-500">
                  필터를 선택해서 검색해보세요.
                </Text>
              )}
            </View>
          )
        }
        ListFooterComponent={
          isLoadingMore ? (
            <View className="flex-row items-center justify-center py-4">
              <ActivityIndicator size="large" color="#6C4DFF" />
            </View>
          ) : isFilterSearchMode &&
            !filterHasMoreData &&
            filterSearchResults.length > 0 ? (
            <View className="items-center justify-center py-4">
              <Text className="text-sm text-gray-500">
                모든 검색 결과를 불러왔습니다.
              </Text>
            </View>
          ) : null
        }
      />

      <CategoryBottomSheet
        isOpen={isCategoryFilterOpen}
        onClose={handleFilterClose}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
        onSearch={handleCategorySearchPress}
      />

      <RegionBottomSheet
        isOpen={isRegionFilterOpen}
        onClose={handleRegionFilterClose}
        selectedRegion={selectedRegion}
        onRegionSelect={handleRegionSelect}
        onSearch={handleRegionSearchPress}
      />
    </View>
  );
}
