import { useEffect, useState } from "react";

import axios, { AxiosError } from "axios";
import { View, Text, ScrollView } from "react-native";

import FilterSection from "@/components/search/SearchFilter";
import { SearchResultUrl } from "@/constants/ApiUrls";
import { Categories } from "@/constants/Categories";
import { Regions } from "@/constants/Regions";
import { SearchResultIndexResponse } from "@/interfaces/search.interfaces";

export default function SearchResult() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
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
    console.log("필터 수정 발생, 새로운 api 요청 필요.");
    const fetchMock = async () => {
      // 가짜 동작임.
      try {
        setIsLoading(true);
        await new Promise((res) => setTimeout(res, 500));
        setResults([
          {
            id: 1,
            title: "서울 아트 전시",
            category: "전시",
            address: "서울 강남구",
            thumbnailUrl: "https://example.com/img1.jpg",
          },
          {
            id: 2,
            title: "부산 카페 투어",
            category: "카페",
            address: "부산 해운대구",
            thumbnailUrl: "https://example.com/img2.jpg",
          },
          {
            id: 3,
            title: "전주 음식 축제",
            category: "푸드",
            address: "전북 전주시",
            thumbnailUrl: "https://example.com/img3.jpg",
          },
        ]);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMock();
  }, [selectedCategories, selectedRegions]);

  return (
    <View>
      <FilterSection
        title="카테고리"
        options={Categories}
        selected={selectedCategories}
        onChange={setSelectedCategories}
      />
      <FilterSection
        title="지역"
        options={Regions}
        selected={selectedRegions}
        onChange={setSelectedRegions}
      />
      <ScrollView aria-label="검색 결과" className="mt-6 px-[18px]">
        <Text className="text-gray-800">
          선택된 카테고리: {selectedCategories.join(", ") || "없음"}
        </Text>
        <Text className="mt-1 text-gray-800">
          선택된 지역: {selectedRegions.join(", ") || "없음"}
        </Text>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          results
            .reduce<SearchResultIndexResponse[][]>((rows, item, idx) => {
              if (idx % 2 === 0) {
                rows.push([item]);
              } else {
                rows[rows.length - 1].push(item);
              }
              return rows;
            }, [])
            .map((row, rowIdx) => (
              <View
                key={rowIdx}
                className="mb-6 flex flex-row justify-between gap-3"
              >
                {row.map((item) => (
                  <View key={item.id} className="w-[48%]">
                    <View className="h-[164px] w-full items-center justify-center rounded-[11px] bg-gray300">
                      {/* 실제 이미지를 사용할 경우 Image 컴포넌트로 교체 */}
                      <Text className="px-2 text-center text-[10px] text-gray600">
                        {item.thumbnailUrl}
                      </Text>
                    </View>
                    <Text className="mt-2 text-[16px] font-semibold leading-[1.3] text-gray800">
                      {item.title}
                    </Text>
                    <Text className="text-[13px] font-normal text-gray500">
                      {item.address}
                    </Text>
                  </View>
                ))}
                {/* 만약 한 개만 있을 경우 오른쪽 공간 확보 */}
                {row.length === 1 && <View className="w-[48%]" />}
              </View>
            ))
        )}
      </ScrollView>
    </View>
  );
}
