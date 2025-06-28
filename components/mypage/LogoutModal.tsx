import { useState } from "react";

import { Modal, TextInput, View, Text, TouchableOpacity } from "react-native";

import {
  useLogoutModalState,
  useSetLogoutModalState,
} from "@/stores/useModalStateStore";

export default function LogoutModal() {
  const isOpen = useLogoutModalState();
  const setIsOpen = useSetLogoutModalState();

  return (
    <Modal visible={isOpen} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/40">
        <View className="w-[60%] rounded-[4px] bg-white pt-10">
          <Text className="mb-4 text-center text-[18px] font-bold text-black">
            로그아웃
          </Text>
          <Text className="mb-10 text-center text-[14px] text-black">
            로그아웃 하시겠어요?
          </Text>
          <View className="flex flex-row justify-between border-t-[1px] border-black">
            <TouchableOpacity
              className="flex min-h-[30px] w-1/2 items-center justify-center border-r-[1px]"
              onPress={() => {
                setIsOpen(false);
              }}
            >
              <Text>닫기</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex w-1/2 items-center justify-center"
              onPress={() => {
                // TODO : 로그아웃 처리할것
                setIsOpen(false);
              }}
            >
              <Text>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
