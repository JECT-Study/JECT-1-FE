import { useState } from "react";

import { Modal, TextInput, View, Text, TouchableOpacity } from "react-native";

import {
  useNicknameModalState,
  useSetNicknameModalState,
} from "@/stores/useModalStateStore";

export default function NicknameModal() {
  const isOpen = useNicknameModalState();
  const setIsOpen = useSetNicknameModalState();
  const [newNickname, setNewNickname] = useState("");
  return (
    <Modal visible={isOpen} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/40">
        <View className="w-[80%] rounded-[4px] bg-white p-6">
          <Text className="mb-4 text-center text-[14px] text-black">
            닉네임 수정
          </Text>
          <TextInput
            placeholder="새 닉네임 입력"
            className="mb-4 rounded-[4px] border border-gray-300 px-3 py-2"
            value={newNickname}
            onChangeText={setNewNickname}
          />
          <View className="mt-2 flex flex-row justify-between">
            <TouchableOpacity
              className="flex w-[50%] items-center justify-center rounded-md"
              onPress={() => {
                setNewNickname("");
                setIsOpen(false);
              }}
            >
              <Text>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex w-[50%] items-center justify-center rounded-md"
              onPress={() => {
                // TODO : 닉네임 설정시 제한되는 문자 등 추가 설정 필요
                console.log(newNickname);
                setNewNickname("");
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
