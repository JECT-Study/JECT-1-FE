import { useEffect, useState } from "react";

import { router } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";
import * as Progress from "react-native-progress";

import FilterSection from "@/components/search/SearchFilter";
import { Categories, CategoriesObject } from "@/constants/Categories";
import { Regions, RegionsObject } from "@/constants/Regions";
import { SearchResultIndexResponse } from "@/interfaces/search.interfaces";

const MOCK_DATA: Record<string, SearchResultIndexResponse[]> = {
  PERFORMANCE: [
    {
      id: 1,
      title: "뮤지컬 위키드",
      category: "공연",
      address: "서울 중구",
      thumbnailUrl: "https://example.com/show1.jpg",
    },
    {
      id: 2,
      title: "연극 햄릿",
      category: "공연",
      address: "서울 종로구",
      thumbnailUrl: "https://example.com/show2.jpg",
    },
  ],
  EXHIBITION: [
    {
      id: 3,
      title: "모네와 친구들",
      category: "전시",
      address: "서울 용산구",
      thumbnailUrl: "https://example.com/exhibit1.jpg",
    },
  ],
  FESTIVAL: [
    {
      id: 4,
      title: "부산 바다축제",
      category: "축제",
      address: "부산 해운대구",
      thumbnailUrl: "https://example.com/festival1.jpg",
    },
  ],
  EVENT: [
    {
      id: 5,
      title: "2025 스타트업 밋업",
      category: "행사",
      address: "서울 강남구",
      thumbnailUrl: "https://example.com/event1.jpg",
    },
  ],
};

export default function SearchResult() {
  // TODO : 카테고리 및 지역선택 중복 불가능한지.
  const [selectedCategories, setSelectedCategories] = useState<string>("");
  const [selectedRegions, setSelectedRegions] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResultIndexResponse[]>([]);

  useEffect(() => {
    // const fetchResult = async () => {
    //   try {
    //     const response = await axios.get(SearchResultUrl, {
    //       params: {
    //         keyword: "",
    //         category: selectedCategories,
    //         region: selectedRegions,
    //         page: 1,
    //         size: 10,
    //       },
    //     });
    //     setResults(response.data);
    //   } catch (e) {
    //     const axiosError = e as AxiosError;
    //     alert(`${axiosError.message}`);
    //   }
    // };
    // fetchResult();
    const fetchMock = async () => {
      // UI 동작을 확인하기 위한 가짜 함수입니다.
      try {
        setIsLoading(true);
        setResults([]); // 기존 데이터 초기화
        await new Promise((res) => setTimeout(res, 2000)); // 로딩 시뮬레이션

        const mock = MOCK_DATA[selectedCategories] || [];
        setResults(mock);
        setIsLoading(false);
      } catch (e) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchMock();
  }, [selectedCategories, selectedRegions]);

  return (
    <View className="flex-1">
      <FilterSection
        title="카테고리"
        options={Categories}
        selected={selectedCategories}
        onChange={setSelectedCategories}
        mappingObject={CategoriesObject}
      />
      <FilterSection
        title="지역"
        options={Regions}
        selected={selectedRegions}
        onChange={setSelectedRegions}
        mappingObject={RegionsObject}
      />
      <FlatList
        className="mt-6 px-[18px]"
        data={results}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        onEndReached={() => {
          // TODO 여기에 무한 스크롤 관련 로직 추가
        }}
        contentContainerStyle={{ paddingBottom: 32 }}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 24,
        }}
        renderItem={({ item }) => (
          <Pressable
            className="flex w-[48%] items-center"
            onPress={() => router.push(`/(tabs)/detail/${item.id}`)}
          >
            <View className="min-h-[164px] min-w-[164px] items-center justify-center rounded-[11px] bg-gray300">
              {/* 실제 이미지를 사용할 경우 Image 컴포넌트로 교체 */}
              <Text className="px-2 text-center text-[10px] text-gray600">
                {item.thumbnailUrl}
              </Text>
            </View>
            <View className="w-[164px] justify-start">
              <Text className="mt-2 text-[16px] font-semibold leading-[1.3] text-gray800">
                {item.title}
              </Text>
              <Text className="text-[13px] font-normal text-gray500">
                {item.address}
              </Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          isLoading ? (
            <View className="min-h-[300px] flex-1 items-center justify-center">
              <Progress.Circle size={30} indeterminate={true} />
            </View>
          ) : (
            <View className="min-h-[300px] flex-1 items-center justify-center">
              <Text className="text-center text-gray500">
                검색 결과가 없습니다.
              </Text>
            </View>
          )
        }
      />
    </View>
  );
}
