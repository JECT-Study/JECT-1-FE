import React from "react";

import { Modal, Pressable, Text, View } from "react-native";

interface CommonModalProps {
  visible: boolean;
  onClose: () => void;
  mainTitle: string;
  subTitle?: string;
  showSubTitle?: boolean;
  cancelText?: string;
  confirmText?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  showCancelButton?: boolean;
}

export default function CommonModal({
  visible,
  onClose,
  mainTitle,
  subTitle,
  showSubTitle = true,
  cancelText = "취소",
  confirmText = "확인",
  onCancel,
  onConfirm,
  showCancelButton = true,
}: CommonModalProps) {
  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 items-center justify-center bg-black/50"
        onPress={onClose}
      >
        <Pressable
          className="mx-5 w-[90%] max-w-[320px] rounded-3xl bg-white p-6"
          onPress={(e) => e.stopPropagation()}
        >
          <Text className="text-center text-xl font-semibold text-[#212121]">
            {mainTitle}
          </Text>

          {showSubTitle && subTitle && (
            <Text className="mt-3 text-center text-base text-[#424242]">
              {subTitle}
            </Text>
          )}

          <View className={`mt-6 ${showCancelButton ? "flex-row gap-3" : ""}`}>
            {showCancelButton && (
              <Pressable
                className="flex-1 items-center justify-center rounded-xl border border-[#E0E0E0] bg-white py-3.5"
                onPress={handleCancel}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              >
                <Text className="text-center text-lg font-medium text-[#616161]">
                  {cancelText}
                </Text>
              </Pressable>
            )}

            <Pressable
              className={`${showCancelButton ? "flex-1" : "w-full"} items-center justify-center rounded-xl bg-[#6C4DFF] py-3.5`}
              onPress={handleConfirm}
              style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
            >
              <Text className="text-center text-lg font-semibold text-white">
                {confirmText}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
