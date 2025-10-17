import { useCallback, useEffect, useRef } from "react";

import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Pressable, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ActionButton {
  label: string;
  onPress: () => void;
  color?: string; // 텍스트 색상
}

interface ActionBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  actions: ActionButton[]; // 액션 버튼들의 배열
  snapPoint?: number; // 바텀시트 높이 (기본값: 자동 계산)
}

export default function ActionBottomSheet({
  isOpen,
  onClose,
  actions,
  snapPoint,
}: ActionBottomSheetProps) {
  const bottomSheetRef = useRef<BottomSheet | null>(null);
  const insets = useSafeAreaInsets();

  // 액션 개수에 따라 동적으로 높이 계산 (각 버튼 60px + 간격 8px + 상하 패딩)
  const calculatedSnapPoint = snapPoint || actions.length * 68 + 32;

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
      snapPoints={[calculatedSnapPoint]}
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
        {actions.map((action, index) => (
          <Pressable
            key={index}
            onPress={action.onPress}
            className="flex-row items-center justify-center rounded-xl bg-[#F1F1F1] px-6 py-4"
          >
            <Text
              className="text-xl font-medium"
              style={{ color: action.color || "#007AFF" }}
            >
              {action.label}
            </Text>
          </Pressable>
        ))}
      </BottomSheetView>
    </BottomSheet>
  );
}
