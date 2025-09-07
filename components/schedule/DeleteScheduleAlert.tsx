import React from "react";

import { Modal, Pressable, Text, View } from "react-native";

interface DeleteScheduleAlertProps {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteScheduleAlert({
  isVisible,
  onConfirm,
  onCancel,
}: DeleteScheduleAlertProps) {
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
              일정삭제
            </Text>
          </View>

          {/* 메시지 */}
          <View className="px-6 pb-5">
            <Text className="text-center text-base text-gray-800">
              나의 일정을 삭제하시겠습니까?
            </Text>
          </View>

          {/* 버튼 영역 */}
          <View className="flex-row">
            <Pressable
              onPress={onCancel}
              className="flex-1 items-center justify-center border-r border-t border-gray-200 py-4"
            >
              <Text className="text-base text-gray-800">취소</Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              className="flex-1 items-center justify-center border-t border-gray-200 py-4"
            >
              <Text className="text-base text-[#F43630]">네, 삭제할게요.</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
