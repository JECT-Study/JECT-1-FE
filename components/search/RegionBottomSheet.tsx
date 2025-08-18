import { useCallback, useEffect, useRef, useState } from "react";

import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Platform, Pressable, Text, View } from "react-native";

import X from "@/components/icons/X";

interface RegionBottomSheetProps {
  /** 바텀시트 표시 여부 */
  isOpen: boolean;
  /** 바텀시트 닫기 함수 */
  onClose: () => void;
  /** 현재 선택된 지역 */
  selectedRegion: string;
  /** 지역 선택 함수 */
  onRegionSelect: (region: string) => void;
}

const regions = [
  { key: "ALL", label: "전체" },
  { key: "SEOUL", label: "서울" },
  { key: "GYEONGGI_INCHEON", label: "경기/인천" },
  { key: "GANGWON", label: "강원" },
  { key: "CHUNGCHEONG", label: "충청권" },
  { key: "CHUNGNAM", label: "충남" },
  { key: "DAEGU_GYEONGBUK", label: "대구/경북" },
  { key: "GYEONGNAM_ULSAN", label: "경남/울산" },
  { key: "GWANGJU_JEONNAM", label: "광주/전남" },
  { key: "JEONBUK", label: "전북" },
  { key: "BUSAN", label: "부산" },
  { key: "JEJU", label: "제주" },
];

export default function RegionBottomSheet({
  isOpen,
  onClose,
  selectedRegion,
  onRegionSelect,
}: RegionBottomSheetProps) {
  const [tempSelectedRegion, setTempSelectedRegion] =
    useState<string>(selectedRegion);
  const bottomSheetRef = useRef<BottomSheet | null>(null);

  // 바텀시트 열기/닫기 처리
  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.expand();
      setTempSelectedRegion(selectedRegion);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isOpen, selectedRegion]);

  // 지역 선택 처리
  const handleRegionPress = useCallback((regionKey: string) => {
    setTempSelectedRegion(regionKey);
  }, []);

  // 초기화 버튼 처리
  const handleReset = useCallback(() => {
    setTempSelectedRegion("ALL");
    onRegionSelect("ALL");
    onClose();
  }, [onRegionSelect, onClose]);

  // 검색 버튼 처리
  const handleSearch = useCallback(() => {
    onRegionSelect(tempSelectedRegion);
    onClose();
  }, [tempSelectedRegion, onRegionSelect, onClose]);

  return (
    <BottomSheet
      style={{
        marginTop: 20,
        ...(Platform.OS === "web" && {
          paddingHorizontal: 20,
        }),
      }}
      ref={bottomSheetRef}
      index={isOpen ? 0 : -1}
      onClose={onClose}
      enablePanDownToClose
      enableDynamicSizing={true}
      backgroundStyle={{
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: -4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
      }}
      handleIndicatorStyle={{
        backgroundColor: "#D1D5DB",
        width: 40,
        height: 4,
        borderRadius: 2,
        marginTop: 8,
      }}
    >
      <BottomSheetView className="px-4 pb-12">
        {/* 헤더 */}
        <View className="flex-row items-center justify-between pt-4">
          <Text className="text-lg font-semibold text-gray-900">지역</Text>
          <Pressable
            onPress={onClose}
            className="h-6 w-6 items-center justify-center"
          >
            <X size={24} color="#6B7280" />
          </Pressable>
        </View>

        {/* 지역 목록 */}
        <View className="flex-row flex-wrap gap-3 pb-6 pt-2">
          {regions.map((region) => (
            <Pressable
              key={region.key}
              onPress={() => handleRegionPress(region.key)}
              className={`rounded-full px-4 py-2 ${
                tempSelectedRegion === region.key
                  ? "border border-[#6C4DFF] bg-[#DFD8FD]"
                  : "border border-[#E0E0E0] bg-white"
              }`}
            >
              <Text
                className={`font-base text-sm ${
                  tempSelectedRegion === region.key
                    ? "text-[#6C4DFF]"
                    : "text-[#707070]"
                }`}
              >
                {region.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* 하단 버튼들 */}
        <View
          className={`flex-row gap-3 pt-6 ${Platform.OS === "web" ? "pb-11" : ""}`}
        >
          <Pressable
            className="flex-1 rounded-lg border border-[#E0E0E0] py-4"
            onPress={handleReset}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <Text className="text-center text-base font-medium text-[#707070]">
              초기화
            </Text>
          </Pressable>

          <Pressable
            className="flex-1 rounded-lg bg-[#6C4DFF] py-4"
            onPress={handleSearch}
            style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
          >
            <Text className="text-center text-base font-bold text-white">
              검색
            </Text>
          </Pressable>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}
