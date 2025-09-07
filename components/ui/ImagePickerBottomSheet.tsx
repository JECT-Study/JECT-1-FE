import { useCallback, useEffect, useRef } from "react";

import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Pressable, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ImagePickerBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onLibrary: () => void;
}

export default function ImagePickerBottomSheet({
  isOpen,
  onClose,
  onLibrary,
}: ImagePickerBottomSheetProps) {
  const bottomSheetRef = useRef<BottomSheet | null>(null);
  const insets = useSafeAreaInsets();

  // 바텀시트 열기/닫기 처리
  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isOpen]);

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
      snapPoints={[200]} // 고정 높이
      onClose={onClose}
      enablePanDownToClose
      style={{ zIndex: 200 }}
      backgroundStyle={{
        backgroundColor: "transparent",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: -4,
        },
        shadowOpacity: isOpen ? 0.1 : 0,
        shadowRadius: isOpen ? 8 : 0,
        elevation: isOpen ? 10 : 0,
      }}
      handleIndicatorStyle={{
        display: "none",
      }}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView
        className="flex-col gap-y-2 px-4"
        style={{ paddingBottom: insets.bottom }}
      >
        <Pressable
          onPress={() => {
            onLibrary();
            onClose();
          }}
          className="flex-row items-center justify-center rounded-xl bg-[#F1F1F1] px-6 py-4"
        >
          <Text className="text-xl font-medium text-[#007AFF]">
            앨범에서 선택
          </Text>
        </Pressable>

        <Pressable
          onPress={onClose}
          className="flex-row items-center justify-center rounded-xl bg-[#F1F1F1] px-6 py-4"
        >
          <Text className="text-xl font-medium text-[#007AFF]">닫기</Text>
        </Pressable>
      </BottomSheetView>
    </BottomSheet>
  );
}
