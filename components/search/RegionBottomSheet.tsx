import { useCallback, useEffect, useRef, useState } from "react";

import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CloseX from "@/components/icons/CloseX";

interface RegionBottomSheetProps {
  /** 바텀시트 표시 여부 */
  isOpen: boolean;
  /** 바텀시트 닫기 함수 */
  onClose: () => void;
  /** 현재 선택된 지역 */
  selectedRegion: string;
  /** 지역 선택 함수 */
  onRegionSelect: (region: string) => void;
  /** 검색 버튼 클릭 함수 */
  onSearch: (region: string) => void;
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
  onSearch,
}: RegionBottomSheetProps) {
  const [tempSelectedRegion, setTempSelectedRegion] =
    useState<string>(selectedRegion);
  const bottomSheetRef = useRef<BottomSheet | null>(null);
  const insets = useSafeAreaInsets();

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
    onSearch(tempSelectedRegion);
    onClose();
  }, [tempSelectedRegion, onSearch, onClose]);

  // Backdrop 렌더링 (외부 터치시 닫기)
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={onClose}
      />
    ),
    [onClose],
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={isOpen ? 0 : -1}
      snapPoints={[300]} // 300px 고정 높이, 또는 ['50%'] 처럼 퍼센트로도 가능
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
        display: "none",
      }}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView
        className="h-full flex-col justify-between px-5"
        style={{ paddingBottom: insets.bottom }}
      >
        <View>
          {/* 헤더 */}
          <View className="mb-3 mt-1 flex-row items-center justify-between">
            <Text className="text-xl font-semibold text-gray-900">지역</Text>
            <Pressable
              onPress={onClose}
              className="items-center justify-center"
            >
              <CloseX size={14} color="#424242" />
            </Pressable>
          </View>

          {/* 지역 목록 */}
          <View className="flex-row flex-wrap gap-2">
            {regions.map((region) => (
              <Pressable
                key={region.key}
                onPress={() => handleRegionPress(region.key)}
                className={`rounded-full px-3.5 py-1.5 ${
                  tempSelectedRegion === region.key
                    ? "border border-[#6C4DFF] bg-[#DFD8FD]"
                    : "border border-[#E0E0E0] bg-white"
                }`}
              >
                <Text
                  className={`font-base text-base ${
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
        </View>

        {/* 하단 버튼들 */}
        <View className="flex-row gap-3">
          <Pressable
            className="rounded-lg border border-[#E0E0E0] py-4"
            onPress={handleReset}
            style={[{ flex: 3 }]}
          >
            <Text className="text-center text-lg font-medium text-[#707070]">
              초기화
            </Text>
          </Pressable>

          <Pressable
            className="rounded-lg bg-[#6C4DFF] py-4"
            onPress={handleSearch}
            style={[{ flex: 7 }]}
          >
            <Text className="text-center text-lg font-medium text-white">
              검색
            </Text>
          </Pressable>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}
