import React from "react";

import { Modal, Pressable, Text, View } from "react-native";

interface LogoutStatusModalProps {
  isVisible: boolean;
  type: "success" | "error";
  message: string;
  onClose: () => void;
}

export default function LogoutStatusModal({
  isVisible,
  type,
  message,
  onClose,
}: LogoutStatusModalProps) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/50">
        {/* Alert 다이얼로그 */}
        <View className="mx-6 w-80 overflow-hidden rounded-2xl bg-[#F4F4F4]">
          {/* 제목 */}
          <View className="px-6 pb-4 pt-5">
            <Text className="text-center text-lg font-semibold text-[#212121]">
              {type === "success" ? "로그아웃 완료" : "오류"}
            </Text>
          </View>

          {/* 메시지 */}
          <View className="px-6 pb-5">
            <Text className="text-center text-base text-gray-800">
              {message}
            </Text>
          </View>

          {/* 버튼 영역 */}
          <View className="flex-row">
            <Pressable
              onPress={onClose}
              className="flex-1 items-center justify-center border-t border-gray-200 py-4"
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <Text className="text-base text-[#007AFF]">확인</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
