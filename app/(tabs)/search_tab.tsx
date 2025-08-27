import { useCallback, useEffect, useState } from "react";

import axios from "axios";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
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
import { SafeAreaView } from "react-native-safe-area-context";

import Chevron from "@/components/icons/Chevron";
import FilterIcon from "@/components/icons/FilterIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import FilterBottomSheet from "@/components/search/FilterBottomSheet";
import RegionBottomSheet from "@/components/search/RegionBottomSheet";
import Divider from "@/components/ui/Divider";
import { BACKEND_URL } from "@/constants/ApiUrls";
import { authApi } from "@/features/axios/axiosInstance";

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

// 기본 데이터 인터페이스 (HomeScreen API)
interface DefaultContentItem {
  contentId: number;
  title: string;
  image: string;
  contentType: string;
  address: string;
  longitude: number;
  latitude: number;
  startDate: string;
  endDate: string;
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
          source={require("../../assets/images/content_placeholder.png")}
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
  const [defaultData, setDefaultData] = useState<SearchContentItem[]>([]);
  const [searchResults, setSearchResults] = useState<SearchContentItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false); // 사용자가 한 번이라도 검색을 수행했는지 여부 (기본 데이터 vs 검색 결과 구분용)
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

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);

        const response = await axios.get(
          `${BACKEND_URL}/home/festival/hot?category=PERFORMANCE`,
        );

        if (response.data.isSuccess && response.data.result) {
          // 기본 데이터를 SearchContentItem 형식으로 변환
          const transformedData = response.data.result.map(
            (item: DefaultContentItem) => ({
              id: item.contentId,
              title: item.title,
              thumbnailUrl: item.image,
              category: item.contentType,
              address: item.address,
              date: item.startDate,
              views: 0, // 기본 데이터에는 views가 없으므로 0으로 설정
            }),
          );
          setDefaultData(transformedData);
        }
      } catch (error) {
        console.error("기본 데이터 로딩 실패:", error);
        setDefaultData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // 키워드 검색 함수
  const searchContent = useCallback(
    async (keyword: string, page: number = 1, isLoadMore: boolean = false) => {
      if (!keyword.trim()) {
        // 검색어가 없으면 검색 상태 초기화
        setHasSearched(false);
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
          setHasSearched(true);
        }

        const response = await authApi.get(`${BACKEND_URL}/search`, {
          params: {
            keyword: keyword,
            page: page, // 정상 페이지네이션
            // page: 1, // [테스트용] 임시로 항상 첫 페이지 호출
            limit: SEARCH_LIMIT,
            sort: "latest",
            ...(selectedCategory !== "ALL" && { category: selectedCategory }),
          },
        });

        if (
          response.data.isSuccess &&
          response.data.result &&
          response.data.result.contents
        ) {
          const newResults = response.data.result.contents;
          const totalCount = response.data.result.totalCount;
          const currentPage = response.data.result.currentPage;

          if (isLoadMore) {
            // 정상 로직: API에서 받은 데이터를 그대로 추가
            setSearchResults((prev) => [...prev, ...newResults]);

            // [테스트용] ID 중복 방지를 위해 페이지 번호만큼 더해서 새로운 ID 생성
            // const modifiedResults = newResults.map((item: any) => ({
            //   ...item,
            //   id: item.id + page * 1000, // 페이지별로 1000씩 더해서 ID 중복 방지
            // }));
            // setSearchResults((prev) => [...prev, ...modifiedResults]);
            // console.log("추가된 결과 (ID 수정됨):", modifiedResults);
          } else {
            // 새로운 검색 결과로 교체
            setSearchResults(newResults);
          }

          setCurrentPage(currentPage);

          // 정상 로직: API 응답 기반으로 더 불러올 데이터 확인
          const totalPages = Math.ceil(totalCount / SEARCH_LIMIT);
          setHasMoreData(currentPage < totalPages);

          // [테스트용] 임시로 최대 5페이지까지만 로딩 가능하도록 설정
          // setHasMoreData(page < 5);

          console.log("검색 결과:", newResults);
          console.log(
            `페이지: ${currentPage}/${totalPages}, 총 ${totalCount}개`,
          );
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
    [selectedCategory],
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
          setHasSearched(false); // 키워드 검색 모드 해제
        }

        const regionKeyword = getRegionKeyword(region);

        // API 파라미터 구성
        const params: any = {
          page: page,
          size: SEARCH_LIMIT,
        };

        // 카테고리와 지역 필터 조건 추가
        if (category !== "ALL") {
          params.category = category;
        }

        if (region !== "ALL") {
          params.keyword = regionKeyword;
          params.region = regionKeyword;
        } else if (category !== "ALL") {
          // 카테고리만 선택된 경우 빈 키워드
          params.keyword = "";
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

          console.log("필터 검색 결과:", transformedResults);
          console.log("필터 검색 파라미터:", params);
          console.log(
            `페이지: ${pageInfo.currentPage}/${pageInfo.totalPages}, 총 ${pageInfo.totalElements}개`,
          );
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
    [],
  );

  // 필터 바텀시트 열기/닫기 함수
  const handleFilterOpen = useCallback(() => {
    setIsCategoryFilterOpen(true);
  }, []);

  const handleFilterClose = useCallback(() => {
    setIsCategoryFilterOpen(false);
  }, []);

  // 카테고리 선택 처리
  const handleCategorySelect = useCallback(
    (category: string) => {
      setSelectedCategory(category);

      // 필터 검색 실행 (카테고리 또는 지역이 ALL이 아닌 경우)
      if (category !== "ALL" || selectedRegion !== "ALL") {
        setFilterSearchPage(1);
        setFilterHasMoreData(true);
        searchByFilters(category, selectedRegion, 1, false);
      } else {
        // 둘 다 ALL 선택 시 필터 검색 모드 해제
        setIsFilterSearchMode(false);
        setFilterSearchResults([]);
        setHasSearched(false);
      }
    },
    [searchByFilters, selectedRegion],
  );

  // 지역 바텀시트 열기/닫기 함수
  const handleRegionFilterOpen = useCallback(() => {
    setIsRegionFilterOpen(true);
  }, []);

  const handleRegionFilterClose = useCallback(() => {
    setIsRegionFilterOpen(false);
  }, []);

  // 지역 선택 처리
  const handleRegionSelect = useCallback(
    (region: string) => {
      setSelectedRegion(region);

      // 필터 검색 실행 (카테고리 또는 지역이 ALL이 아닌 경우)
      if (region !== "ALL" || selectedCategory !== "ALL") {
        setFilterSearchPage(1);
        setFilterHasMoreData(true);
        searchByFilters(selectedCategory, region, 1, false);
      } else {
        // 둘 다 ALL 선택 시 필터 검색 모드 해제
        setIsFilterSearchMode(false);
        setFilterSearchResults([]);
        setHasSearched(false);
      }
    },
    [searchByFilters, selectedCategory],
  );

  // 무한스크롤 핸들러
  const handleLoadMore = useCallback(() => {
    if (isFilterSearchMode && filterHasMoreData && !isLoadingMore) {
      // 필터 검색 모드에서의 무한스크롤
      const nextPage = filterSearchPage + 1;
      console.log(`필터 검색 다음 페이지 로딩: ${nextPage}`);
      searchByFilters(selectedCategory, selectedRegion, nextPage, true);
    } else if (
      hasSearched &&
      hasMoreData &&
      !isLoadingMore &&
      searchText.trim()
    ) {
      // 키워드 검색 모드에서의 무한스크롤
      const nextPage = currentPage + 1;
      console.log(`키워드 검색 다음 페이지 로딩: ${nextPage}`);
      searchContent(searchText, nextPage, true);
    }
  }, [
    isFilterSearchMode,
    filterHasMoreData,
    filterSearchPage,
    selectedCategory,
    selectedRegion,
    hasSearched,
    hasMoreData,
    isLoadingMore,
    searchText,
    currentPage,
    searchContent,
    searchByFilters,
  ]);

  // 검색 상태에 따라 표시할 데이터 결정
  const displayData = isFilterSearchMode
    ? filterSearchResults
    : hasSearched
      ? searchResults
      : defaultData;

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
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <View className={`px-4 pb-4 ${Platform.OS === "web" ? "pt-10" : "pt-2"}`}>
        <View className="flex-row items-center rounded-full border-[1.2px] border-[#6C4DFF] bg-white px-4 py-3">
          <SearchIcon size={20} color="#6C4DFF" />
          <TextInput
            className="ml-3 flex-1 text-[16px] text-gray-700"
            placeholder="이번 주말, 뭐할까?"
            placeholderTextColor="#9CA3AF"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={() => {
              setCurrentPage(1);
              setHasMoreData(true);
              searchContent(searchText, 1, false);
            }}
            returnKeyType="search"
          />
        </View>
      </View>

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
            isCategoryFilterOpen
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
              isCategoryFilterOpen
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
              isCategoryFilterOpen
                ? "#6C4DFF"
                : isRegionFilterOpen
                  ? "#9CA3AF"
                  : "#424242"
            }
          />
        </Pressable>

        <Pressable
          className={`flex-row items-center rounded-full px-3 py-2 ${
            isRegionFilterOpen
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
              isRegionFilterOpen
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
              isRegionFilterOpen
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
                {isFilterSearchMode
                  ? "필터 검색 중..."
                  : hasSearched
                    ? "검색 중..."
                    : "데이터를 불러오는 중..."}
              </Text>
            </View>
          ) : (
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-center text-gray-500">
                {isFilterSearchMode
                  ? "필터 검색 결과가 없습니다."
                  : hasSearched
                    ? "검색 결과가 없습니다."
                    : "데이터가 없습니다."}
              </Text>
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
          ) : hasSearched && !hasMoreData && searchResults.length > 0 ? (
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
      />

      <RegionBottomSheet
        isOpen={isRegionFilterOpen}
        onClose={handleRegionFilterClose}
        selectedRegion={selectedRegion}
        onRegionSelect={handleRegionSelect}
      />
    </SafeAreaView>
  );
}
