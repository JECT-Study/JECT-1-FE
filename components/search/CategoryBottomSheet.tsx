import { useCallback, useEffect, useRef, useState } from "react";

import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CloseX from "@/components/icons/CloseX";

interface FilterBottomSheetProps {
  /** 바텀시트 표시 여부 */
  isOpen: boolean;
  /** 바텀시트 닫기 함수 */
  onClose: () => void;
  /** 현재 선택된 카테고리 */
  selectedCategory: string;
  /** 카테고리 선택 함수 */
  onCategorySelect: (category: string) => void;
  /** 검색 버튼 클릭 함수 */
  onSearch: (category: string) => void;
}

const categories = [
  { key: "ALL", label: "전체" },
  { key: "PERFORMANCE", label: "공연" },
  { key: "EXHIBITION", label: "전시" },
  { key: "FESTIVAL", label: "축제" },
  { key: "EVENT", label: "행사" },
];

export default function CategoryBottomSheet({
  isOpen,
  onClose,
  selectedCategory,
  onCategorySelect,
  onSearch,
}: FilterBottomSheetProps) {
  const [tempSelectedCategory, setTempSelectedCategory] =
    useState<string>(selectedCategory);
  const bottomSheetRef = useRef<BottomSheet | null>(null);
  const insets = useSafeAreaInsets();

  // 바텀시트 열기/닫기 처리
  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.expand();
      setTempSelectedCategory(selectedCategory);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isOpen, selectedCategory]);

  // 카테고리 선택 처리
  const handleCategoryPress = useCallback((categoryKey: string) => {
    setTempSelectedCategory(categoryKey);
  }, []);

  // 초기화 버튼 처리
  const handleReset = useCallback(() => {
    setTempSelectedCategory("ALL");
    onSearch("ALL");
    onClose();
  }, [onSearch, onClose]);

  // 검색 버튼 처리
  const handleSearch = useCallback(() => {
    onSearch(tempSelectedCategory);
    onClose();
  }, [tempSelectedCategory, onSearch, onClose]);

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
      backgroundStyle={{
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        ...(isOpen && {
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 10,
        }),
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
            <Text className="text-xl font-semibold text-gray-900">
              카테고리
            </Text>
            <Pressable
              onPress={onClose}
              className="items-center justify-center"
            >
              <CloseX size={14} color="#424242" />
            </Pressable>
          </View>

          {/* 카테고리 목록 */}
          <View className="flex-row flex-wrap gap-2">
            {categories.map((category) => (
              <Pressable
                key={category.key}
                onPress={() => handleCategoryPress(category.key)}
                className={`rounded-full px-3.5 py-1.5 ${
                  tempSelectedCategory === category.key
                    ? "border border-[#6C4DFF] bg-[#DFD8FD]"
                    : "border border-[#E0E0E0] bg-white"
                }`}
              >
                <Text
                  className={`font-base text-base ${
                    tempSelectedCategory === category.key
                      ? "text-[#6C4DFF]"
                      : "text-[#707070]"
                  }`}
                >
                  {category.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* 하단 버튼들 */}
        <View className="flex-row gap-3">
          <Pressable
            className="h-16 items-center justify-center rounded-lg border border-[#E0E0E0] active:bg-gray-100"
            onPress={handleReset}
            style={[{ flex: 3 }]}
          >
            <Text className="text-center text-xl font-medium text-[#707070]">
              초기화
            </Text>
          </Pressable>

          <Pressable
            className="h-16 items-center justify-center rounded-lg bg-[#6C4DFF] active:bg-[#5638E6]"
            onPress={handleSearch}
            style={[{ flex: 7 }]}
          >
            <Text className="text-center text-xl font-semibold text-white">
              검색
            </Text>
          </Pressable>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}
