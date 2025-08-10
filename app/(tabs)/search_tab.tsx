import { useCallback, useEffect, useState } from "react";

import axios from "axios";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";

import Chevron from "@/components/icons/Chevron";
import FilterIcon from "@/components/icons/FilterIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import Divider from "@/components/ui/Divider";
import { BACKEND_URL } from "@/constants/ApiUrls";
import { authApi } from "@/features/axios/axiosInstance";

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

function renderEventCard({ item }: { item: SearchContentItem }) {
  return (
    <Pressable
      className="mb-6 flex w-[48%] items-center"
      onPress={() => {
        router.push(`/detail/${item.id}`);
      }}
    >
      <View className="h-[164px] w-full overflow-hidden rounded-[11px] bg-gray-200">
        <Image
          source={{
            uri:
              item.thumbnailUrl ||
              "https://mfnmcpsoimdf9o2j.public.blob.vercel-storage.com/detail-dummy.png",
          }}
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
            limit: 6,
            sort: "latest",
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
          const totalPages = Math.ceil(totalCount / 6);
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
    [],
  );

  // 무한스크롤 핸들러
  const handleLoadMore = useCallback(() => {
    if (hasSearched && hasMoreData && !isLoadingMore && searchText.trim()) {
      const nextPage = currentPage + 1;
      console.log(`다음 페이지 로딩: ${nextPage}`);
      searchContent(searchText, nextPage, true);
    }
  }, [
    hasSearched,
    hasMoreData,
    isLoadingMore,
    searchText,
    currentPage,
    searchContent,
  ]);

  // 검색 상태에 따라 표시할 데이터 결정
  const displayData = hasSearched ? searchResults : defaultData;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <View className="px-4 pb-4 pt-2">
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
        <Pressable className="mr-4 flex-row items-center">
          <FilterIcon size={19} color="#424242" />
          <Text className="ml-2 text-[14px] text-[#424242]">필터</Text>
        </Pressable>

        <Pressable className="mr-3 flex-row items-center rounded-full border border-[#E0E0E0] bg-white px-3 py-2">
          <Text className="mr-1 text-[14px] text-[#424242]">전체</Text>
          <Chevron direction="down" size={12} color="#424242" />
        </Pressable>

        <Pressable className="flex-row items-center rounded-full border border-[#E0E0E0] bg-white px-3 py-2">
          <Text className="mr-1 text-[14px] text-[#424242]">지역</Text>
          <Chevron direction="down" size={12} color="#424242" />
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
                {hasSearched ? "검색 중..." : "데이터를 불러오는 중..."}
              </Text>
            </View>
          ) : (
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-center text-gray-500">
                {hasSearched ? "검색 결과가 없습니다." : "데이터가 없습니다."}
              </Text>
            </View>
          )
        }
        ListFooterComponent={
          isLoadingMore ? (
            <View className="flex-row items-center justify-center py-4">
              <ActivityIndicator size="large" color="#6C4DFF" />
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
    </SafeAreaView>
  );
}
