import React from "react";

import { Modal, Pressable, Text, View } from "react-native";

interface SurveyExitAlertProps {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function SurveyExitAlert({
  isVisible,
  onConfirm,
  onCancel,
}: SurveyExitAlertProps) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onCancel}
    >
      <View className="flex-1 items-center justify-center bg-black/50">
        {/* Alert 다이얼로그 */}
        <View className="mx-6 w-80 overflow-hidden rounded-2xl bg-[#F4F4F4]">
          {/* 제목 */}
          <View className="px-6 pb-4 pt-5">
            <Text className="text-center text-lg font-semibold text-[#212121]">
              취향 분석을 그만 두시겠어요?
            </Text>
          </View>

          {/* 메시지 */}
          <View className="px-6 pb-5">
            <Text className="text-center text-base text-gray-800">
              선택한 내용은 저장되지 않아요.
            </Text>
          </View>

          {/* 버튼 영역 */}
          <View className="flex-row">
            <Pressable
              onPress={onCancel}
              className="flex-1 items-center justify-center border-r border-t border-gray-200 py-4"
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <Text className="text-base text-gray-800">계속 진행</Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              className="flex-1 items-center justify-center border-t border-gray-200 py-4"
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <Text className="text-base text-[#F43630]">네, 그만둘게요.</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
