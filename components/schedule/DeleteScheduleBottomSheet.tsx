import { useCallback, useEffect, useRef } from "react";

import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Pressable, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface DeleteScheduleBottomSheetProps {
  isOpen: boolean;
  onDelete: () => void;
  onClose: () => void;
  onCancel?: () => void; // 실제 취소 버튼용
}

export default function DeleteScheduleBottomSheet({
  isOpen,
  onDelete,
  onClose,
  onCancel,
}: DeleteScheduleBottomSheetProps) {
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
      snapPoints={[180]} // 고정 높이
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
        className="flex-col gap-y-2 px-4"
        style={{ paddingBottom: insets.bottom }}
      >
        <Pressable
          onPress={onDelete}
          className="flex-row items-center justify-center rounded-xl bg-[#F1F1F1] px-6 py-4"
        >
          <Text className="text-lg text-red-500">삭제하기</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            console.log("바텀시트 취소 버튼 클릭됨");
            if (onCancel) {
              onCancel();
            } else {
              onClose();
            }
          }}
          className="flex-row items-center justify-center rounded-xl bg-[#F1F1F1] px-6 py-4"
        >
          <Text className="text-lg text-blue-500">취소</Text>
        </Pressable>
      </BottomSheetView>
    </BottomSheet>
  );
}
