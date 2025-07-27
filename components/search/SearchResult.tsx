import { useState } from "react";

import { View, Text } from "react-native";

import FilterSection from "@/components/search/SearchFilter";
import { Categories } from "@/constants/Categories";
import { Regions } from "@/constants/Regions";

export default function SearchResult() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  return (
    <View className="py-[18px]">
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
      <View aria-label="검색 결과" className="mt-6 px-[18px]">
        <Text className="text-gray-800">
          선택된 카테고리: {selectedCategories.join(", ") || "없음"}
        </Text>
        <Text className="mt-1 text-gray-800">
          선택된 지역: {selectedRegions.join(", ") || "없음"}
        </Text>
      </View>
    </View>
  );
}
