import { useCallback, useEffect, useState } from "react";

import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import BackArrow from "@/components/icons/BackArrow";
import Chevron from "@/components/icons/Chevron";
import ClearIcon from "@/components/icons/ClearIcon";
import FilterIcon from "@/components/icons/FilterIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import FilterBottomSheet from "@/components/search/FilterBottomSheet";
import RegionBottomSheet from "@/components/search/RegionBottomSheet";
import Divider from "@/components/ui/Divider";
import { BACKEND_URL } from "@/constants/ApiUrls";
import { authApi } from "@/features/axios/axiosInstance";
import { getImageSource } from "@/utils/imageUtils";

const SEARCH_LIMIT = 10; // 페이지당 검색 결과 개수

// 지역 코드를 한글 이름으로 변환하는 함수
const getRegionKeyword = (regionKey: string): string => {
  const regionMap: { [key: string]: string } = {
    ALL: "",
    SEOUL: "서울",
    GYEONGGI_INCHEON: "경기",
    GANGWON: "강원",
    CHUNGCHEONG: "충청",
    CHUNGNAM: "충남",
    DAEGU_GYEONGBUK: "대구",
    GYEONGNAM_ULSAN: "경남",
    GWANGJU_JEONNAM: "광주",
    JEONBUK: "전북",
    BUSAN: "부산",
    JEJU: "제주",
  };
  return regionMap[regionKey] || "";
};

// 검색 결과 인터페이스 (Search API)
interface SearchContentItem {
  id: number;
  title: string;
  thumbnailUrl: string;
  category: string;
  address: string;
  date: string;
  views: number;
}

// 카테고리 검색 결과 인터페이스 (Category Search API)
interface CategorySearchItem {
  id: number;
  title: string;
  category: string;
  address: string;
  thumbnailUrl: string | null;
}

interface CategorySearchResponse {
  isSuccess: boolean;
  code: number;
  message: string;
  result: {
    contentList: CategorySearchItem[];
    pageInfo: {
      currentPage: number;
      totalPages: number;
      totalElements: number;
    };
  };
}

interface EventCardProps {
  item: SearchContentItem;
  onPress: (id: number) => void;
}

// 카테고리 키를 한글 라벨로 변환하는 함수
function getCategoryLabel(category: string): string {
  switch (category) {
    case "PERFORMANCE":
      return "공연";
    case "EXHIBITION":
      return "전시";
    case "FESTIVAL":
      return "축제";
    case "EVENT":
      return "행사";
    case "ALL":
    default:
      return "전체";
  }
}

// 지역 키를 한글 라벨로 변환하는 함수
function getRegionLabel(region: string): string {
  switch (region) {
    case "SEOUL":
      return "서울";
    case "GYEONGGI_INCHEON":
      return "경기/인천";
    case "GANGWON":
      return "강원";
    case "CHUNGCHEONG":
      return "충청권";
    case "CHUNGNAM":
      return "충남";
    case "DAEGU_GYEONGBUK":
      return "대구/경북";
    case "GYEONGNAM_ULSAN":
      return "경남/울산";
    case "GWANGJU_JEONNAM":
      return "광주/전남";
    case "JEONBUK":
      return "전북";
    case "BUSAN":
      return "부산";
    case "JEJU":
      return "제주";
    case "ALL":
    default:
      return "지역";
  }
}

function EventCard({ item, onPress }: EventCardProps) {
  return (
    <Pressable
      className="mb-6 flex w-[48%] items-center"
      onPress={() => onPress(item.id)}
    >
      <View className="h-[164px] w-full overflow-hidden rounded-[11px] bg-gray-200">
        <Image
          source={getImageSource(item.id)}
          className="h-full w-full"
          resizeMode="cover"
        />
      </View>
      <View className="mt-2 w-full">
        <Text
          className="text-[16px] font-semibold leading-5 text-gray-800"
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text className="mt-1 text-[13px] text-gray-500" numberOfLines={1}>
          {item.address}
        </Text>
      </View>
    </Pressable>
  );
}

export default function SearchResults() {
  // URL 파라미터에서 검색어, 카테고리, 지역 값 받기
  const {
    keyword = "",
    category = "ALL",
    region = "ALL",
  } = useLocalSearchParams();

  console.log("받은 검색어:", keyword);
  console.log("받은 카테고리:", category);
  console.log("받은 지역:", region);

  const [searchText, setSearchText] = useState<string>(keyword as string);
  const [searchResults, setSearchResults] = useState<SearchContentItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [hasMoreData, setHasMoreData] = useState<boolean>(true);

  const [selectedCategory, setSelectedCategory] = useState<string>(
    category as string,
  );
  const [isCategoryFilterOpen, setIsCategoryFilterOpen] =
    useState<boolean>(false);
  const [selectedRegion, setSelectedRegion] = useState<string>(
    region as string,
  );
  const [isRegionFilterOpen, setIsRegionFilterOpen] = useState<boolean>(false);

  // 검색 실행 함수
  const executeSearch = useCallback(
    async (
      searchKeyword: string,
      page: number = 1,
      isLoadMore: boolean = false,
    ) => {
      if (!searchKeyword.trim()) {
        setSearchResults([]);
        setCurrentPage(1);
        setHasMoreData(true);
        return;
      }

      try {
        if (isLoadMore) {
          setIsLoadingMore(true);
        } else {
          setIsLoading(true);
        }

        const regionKeyword = getRegionKeyword(selectedRegion);

        const params: any = {
          keyword: searchKeyword,
          page: page,
          limit: SEARCH_LIMIT,
        };

        if (selectedCategory !== "ALL") {
          params.category = selectedCategory;
        }

        if (selectedRegion !== "ALL") {
          params.region = regionKeyword;
        }

        const response = await authApi.get<CategorySearchResponse>(
          `${BACKEND_URL}/search/results`,
          { params },
        );

        console.log("params", params);

        if (response.data.isSuccess && response.data.result) {
          const { contentList, pageInfo } = response.data.result;

          const transformedResults: SearchContentItem[] = contentList.map(
            (item) => ({
              id: item.id,
              title: item.title,
              thumbnailUrl: item.thumbnailUrl || "",
              category: item.category,
              address: item.address,
              date: "",
              views: 0,
            }),
          );

          if (isLoadMore) {
            setSearchResults((prev) => [...prev, ...transformedResults]);
          } else {
            setSearchResults(transformedResults);
          }

          setCurrentPage(pageInfo.currentPage);
          setHasMoreData(pageInfo.currentPage < pageInfo.totalPages);

          console.log("검색 결과:", transformedResults);
          console.log("검색 파라미터:", params);
        } else {
          if (!isLoadMore) {
            setSearchResults([]);
          }
          setHasMoreData(false);
        }
      } catch (error) {
        console.error("검색 실패:", error);
        if (!isLoadMore) {
          setSearchResults([]);
        }
        setHasMoreData(false);
      } finally {
        if (isLoadMore) {
          setIsLoadingMore(false);
        } else {
          setIsLoading(false);
        }
      }
    },
    [selectedCategory, selectedRegion],
  );

  // 페이지 로드 시 자동 검색 실행
  useEffect(() => {
    if (keyword && (keyword as string).trim()) {
      executeSearch(keyword as string, 1, false);
    }
  }, [keyword, executeSearch]);

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
      if (searchText.trim()) {
        executeSearch(searchText, 1, false);
      }
    },
    [searchText, executeSearch],
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
      if (searchText.trim()) {
        executeSearch(searchText, 1, false);
      }
    },
    [searchText, executeSearch],
  );

  // 무한스크롤 핸들러
  const handleLoadMore = useCallback(() => {
    if (
      searchResults.length > 0 &&
      hasMoreData &&
      !isLoadingMore &&
      searchText.trim()
    ) {
      const nextPage = currentPage + 1;
      executeSearch(searchText, nextPage, true);
    }
  }, [
    searchResults.length,
    hasMoreData,
    isLoadingMore,
    searchText,
    currentPage,
    executeSearch,
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
        <View className="flex-row items-center">
          <Pressable onPress={() => router.back()} className="mr-3">
            <BackArrow />
          </Pressable>
          <View
            className={`flex-1 flex-row items-center rounded-full border-[1.2px] border-[#6C4DFF] bg-white px-4 ${Platform.OS === "ios" ? "py-3" : ""}`}
          >
            <SearchIcon size={20} color="#6C4DFF" />
            <TextInput
              className="ml-3 flex-1 text-[15px] text-gray-700"
              placeholder="검색어를 입력해주세요."
              placeholderTextColor="#9CA3AF"
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={() => {
                if (searchText.trim()) {
                  executeSearch(searchText, 1, false);
                }
              }}
              returnKeyType="search"
              style={Platform.OS === "android" ? { paddingVertical: 12 } : {}}
            />
            {searchText.trim() && (
              <Pressable
                onPress={() => setSearchText("")}
                className="ml-2"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <ClearIcon />
              </Pressable>
            )}
          </View>
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
        className="flex-1 pt-8"
        data={searchResults}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 100,
          flexGrow: 1,
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
              <Text className="mt-4 text-center text-gray-500">검색 중...</Text>
            </View>
          ) : (
            <View className="mt-[-70px] flex-1 items-center justify-center">
              <Text className="text-center text-xl font-medium text-gray-700">
                일치하는 검색결과가 없어요.
              </Text>
              <Text className="mt-1 text-center text-lg text-gray-500">
                검색어를 변경해 보세요!
              </Text>
            </View>
          )
        }
        ListFooterComponent={
          isLoadingMore ? (
            <View className="flex-row items-center justify-center py-4">
              <ActivityIndicator size="large" color="#6C4DFF" />
            </View>
          ) : searchResults.length > 0 && !hasMoreData ? (
            <View className="items-center justify-center py-4">
              <Text className="text-sm text-gray-500">
                모든 검색 결과를 불러왔습니다.
              </Text>
            </View>
          ) : null
        }
      />

      <FilterBottomSheet
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
