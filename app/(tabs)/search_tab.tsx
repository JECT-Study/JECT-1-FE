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
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import Chevron from "@/components/icons/Chevron";
import FilterIcon from "@/components/icons/FilterIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import FilterBottomSheet from "@/components/search/FilterBottomSheet";
import RegionBottomSheet from "@/components/search/RegionBottomSheet";
import Divider from "@/components/ui/Divider";
import { BACKEND_URL } from "@/constants/ApiUrls";
import { authApi } from "@/features/axios/axiosInstance";
import { getImageSource } from "@/utils/imageUtils";

const SEARCH_LIMIT = 8; // 페이지당 검색 결과 개수

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

// 최근 검색어 API 응답 인터페이스
interface RecentSearchResponse {
  isSuccess: boolean;
  code: number;
  message: string;
  result: string[];
}

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

export default function SearchScreen() {
  const [searchText, setSearchText] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchContentItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1); // 현재 검색 결과의 페이지 번호 (무한스크롤로 다음 페이지 요청 시 사용)
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false); // 무한스크롤로 추가 데이터를 불러오는 중인지 여부 (하단 로딩 인디케이터 표시용)
  const [hasMoreData, setHasMoreData] = useState<boolean>(true); // 더 불러올 데이터가 있는지 여부 (무한스크롤 중단 조건)

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

  const [recentSearches, setRecentSearches] = useState<string[]>([]); // 최근 검색어
  const [hasInitialSearched, setHasInitialSearched] = useState<boolean>(false); // 최초 검색 여부

  // 탭 포커스 시 StatusBar 스타일 설정
  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle("dark");
      fetchRecentSearches();
    }, []),
  );

  const fetchRecentSearches = async () => {
    try {
      const response = await authApi.get<RecentSearchResponse>(
        `${BACKEND_URL}/search/recent`,
      );
      if (response.data.isSuccess && response.data.result) {
        setRecentSearches(response.data.result);
      }
    } catch (error) {
      console.error("최근 검색어 로딩 실패:", error);
      setRecentSearches([]);
    }
  };

  // 최근 검색어 클릭 처리
  const handleRecentSearchClick = (keyword: string) => {
    setSearchText(keyword);
    setCurrentPage(1);
    setHasMoreData(true);
    searchContent(keyword, 1, false);
  };

  // 최근 검색어 삭제 처리
  const handleDeleteRecentSearch = async (keyword: string) => {
    try {
      const response = await authApi.delete(
        `${BACKEND_URL}/search/keywords/${encodeURIComponent(keyword)}`,
      );
      if (response.data.isSuccess) {
        // 삭제 성공 시 목록에서 제거
        setRecentSearches((prev) => prev.filter((item) => item !== keyword));
      }
    } catch (error) {
      console.error("최근 검색어 삭제 실패:", error);
    }
  };

  // 최근 검색어 전체 삭제 처리
  const handleDeleteAllRecentSearches = async () => {
    try {
      const response = await authApi.delete(`${BACKEND_URL}/search/keywords`);
      if (response.data.isSuccess) {
        // 전체 삭제 성공 시 목록 비우기
        setRecentSearches([]);
      }
    } catch (error) {
      console.error("최근 검색어 전체 삭제 실패:", error);
    }
  };

  // 최초 검색 함수 (/search API)
  const searchContent = useCallback(
    async (keyword: string, page: number = 1, isLoadMore: boolean = false) => {
      if (!keyword.trim()) {
        // 검색어가 없으면 검색 상태 초기화
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

        let response;

        // 최초 검색인지 확인
        if (!hasInitialSearched) {
          // 최초 검색: /search API 사용
          response = await authApi.get(`${BACKEND_URL}/search`, {
            params: {
              keyword: keyword,
              page: page,
              limit: SEARCH_LIMIT,
              sort: "latest",
            },
          });

          if (!isLoadMore) {
            setHasInitialSearched(true); // 최초 검색 완료 표시
          }
        } else {
          // 최초 검색 이후: /search/results API 사용
          const regionKeyword =
            selectedRegion !== "ALL" ? getRegionKeyword(selectedRegion) : "";

          response = await authApi.get(`${BACKEND_URL}/search/results`, {
            params: {
              keyword: keyword,
              ...(selectedCategory !== "ALL" && { category: selectedCategory }),
              ...(selectedRegion !== "ALL" && { region: regionKeyword }),
              page: page,
              size: SEARCH_LIMIT,
            },
          });
        }

        if (response.data.isSuccess && response.data.result) {
          let newResults, totalPages, currentPageNum;

          if (!hasInitialSearched) {
            // /search API 응답 처리
            if (response.data.result.contents) {
              newResults = response.data.result.contents;
              const totalCount = response.data.result.totalCount;
              currentPageNum = response.data.result.currentPage;
              totalPages = Math.ceil(totalCount / SEARCH_LIMIT);
            } else {
              newResults = [];
              totalPages = 0;
              currentPageNum = 1;
            }
          } else {
            // /search/results API 응답 처리
            const { contentList, pageInfo } = response.data.result;
            newResults = contentList.map((item: CategorySearchItem) => ({
              id: item.id,
              title: item.title,
              thumbnailUrl: item.thumbnailUrl || "",
              category: item.category,
              address: item.address,
              date: "",
              views: 0,
            }));
            currentPageNum = pageInfo.currentPage;
            totalPages = pageInfo.totalPages;
          }

          if (isLoadMore) {
            setSearchResults((prev) => [...prev, ...newResults]);
          } else {
            setSearchResults(newResults);
            setIsFilterSearchMode(false); // 필터 검색 모드 해제
            setFilterSearchResults([]); // 필터 검색 결과 초기화
          }

          setCurrentPage(currentPageNum);
          setHasMoreData(currentPageNum < totalPages);

          console.log("검색 결과:", newResults);
          console.log(`페이지: ${currentPageNum}/${totalPages}`);
        } else {
          if (!isLoadMore) {
            setSearchResults([]);
          }
          setHasMoreData(false);
          console.log("검색 결과 없음 또는 API 오류");
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
    [hasInitialSearched, selectedCategory, selectedRegion],
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
          keyword: searchText, // 사용자 입력 키워드 사용
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
            setSearchResults([]); // 일반 검색 결과 지우기
          }

          setFilterSearchPage(pageInfo.currentPage);
          setFilterHasMoreData(pageInfo.currentPage < pageInfo.totalPages);

          console.log("필터 검색 결과:", transformedResults);
          console.log("필터 검색 파라미터:", params);
        } else {
          if (!isLoadMore) {
            setFilterSearchResults([]);
          }
          setFilterHasMoreData(false);
          console.log("필터 검색 결과 없음 또는 API 오류");
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
    [searchText],
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
      if (hasInitialSearched && searchText.trim()) {
        searchByFilters(category, selectedRegion, 1, false);
      }
    },
    [hasInitialSearched, searchText, selectedRegion, searchByFilters],
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
      if (hasInitialSearched && searchText.trim()) {
        searchByFilters(selectedCategory, region, 1, false);
      }
    },
    [hasInitialSearched, searchText, selectedCategory, searchByFilters],
  );

  // 무한스크롤 핸들러
  const handleLoadMore = useCallback(() => {
    if (isFilterSearchMode && filterHasMoreData && !isLoadingMore) {
      // 필터 검색 모드에서의 무한스크롤
      const nextPage = filterSearchPage + 1;
      searchByFilters(selectedCategory, selectedRegion, nextPage, true);
    } else if (
      searchResults.length > 0 &&
      hasMoreData &&
      !isLoadingMore &&
      searchText.trim()
    ) {
      // 키워드 검색 모드에서의 무한스크롤
      const nextPage = currentPage + 1;
      searchContent(searchText, nextPage, true);
    }
  }, [
    isFilterSearchMode,
    filterHasMoreData,
    filterSearchPage,
    selectedCategory,
    selectedRegion,
    searchResults.length,
    hasMoreData,
    isLoadingMore,
    searchText,
    currentPage,
    searchContent,
    searchByFilters,
  ]);

  // 검색 상태에 따라 표시할 데이터 결정
  const displayData = isFilterSearchMode ? filterSearchResults : searchResults;

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
        <View
          className={`flex-row items-center rounded-full border-[1.2px] border-[#6C4DFF] bg-white px-4 ${Platform.OS === "ios" ? "py-3" : ""}`}
        >
          <SearchIcon size={20} color="#6C4DFF" />
          <TextInput
            className="ml-3 flex-1 text-[16px] text-gray-700"
            placeholder="이번 주말, 뭐할까?"
            placeholderTextColor="#9CA3AF"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={() => {
              if (searchText.trim()) {
                setCurrentPage(1);
                setHasMoreData(true);
                searchContent(searchText, 1, false);
              }
            }}
            returnKeyType="search"
            style={Platform.OS === "android" ? { paddingVertical: 12 } : {}}
          />
        </View>
      </View>

      {/* 필터 영역 - 최초 검색 이후에만 표시 */}
      {hasInitialSearched && (
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
      )}

      <Divider />

      {/* 최근 검색어 영역 - 최초 검색 전에만 표시 */}
      {!hasInitialSearched &&
        searchResults.length === 0 &&
        !isFilterSearchMode && (
          <View className="px-4 py-4">
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-[15px] font-medium text-gray-800">
                최근 검색어
              </Text>
              {recentSearches.length > 0 && (
                <Pressable onPress={handleDeleteAllRecentSearches}>
                  <Text className="text-[13px] text-gray-500">전체삭제</Text>
                </Pressable>
              )}
            </View>

            {recentSearches.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="-mx-4 px-4"
              >
                <View className="flex-row gap-2">
                  {recentSearches.map((keyword, index) => (
                    <View
                      key={index}
                      className="flex-row items-center rounded-full bg-[#F3F0FF] px-3 py-2"
                    >
                      <Pressable
                        onPress={() => handleRecentSearchClick(keyword)}
                        className="mr-2"
                      >
                        <Text className="text-[14px] text-[#6C4DFF]">
                          {keyword}
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() => handleDeleteRecentSearch(keyword)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Text className="text-[16px] text-[#6C4DFF]">×</Text>
                      </Pressable>
                    </View>
                  ))}
                </View>
              </ScrollView>
            ) : (
              <View className="flex-1 items-center justify-center py-12">
                <Text className="text-center text-[16px] font-medium text-gray-800">
                  최근 검색어가 없어요.
                </Text>
                <Text className="mt-1 text-center text-[14px] text-gray-500">
                  관심사를 검색해보세요!
                </Text>
              </View>
            )}
          </View>
        )}

      <FlatList
        className={
          !hasInitialSearched &&
          searchResults.length === 0 &&
          !isFilterSearchMode
            ? ""
            : "pt-8"
        }
        data={displayData}
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
              ) : searchText ? (
                <Text className="text-center text-gray-500">
                  일치하는 검색 결과가 없어요.
                </Text>
              ) : recentSearches.length === 0 ? (
                <>
                  <Text className="text-center text-[16px] font-medium text-gray-800">
                    최근 검색어가 없어요.
                  </Text>
                  <Text className="mt-1 text-center text-[14px] text-gray-500">
                    관심사를 검색해보세요!
                  </Text>
                </>
              ) : null}
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
                모든 필터 검색 결과를 불러왔습니다.
              </Text>
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
