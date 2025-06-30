import { Pressable, Text, TextInput, View } from "react-native";

import XIcon from "@/components/icons/X";
import {
  useSetTempNickname,
  useTempNickname,
} from "@/stores/useEditProfileStore";

export default function EditProfileNickname() {
  const setInputNickname = useSetTempNickname();
  const inputNickname = useTempNickname();
  return (
    <View className="w-full p-6">
      <Text>닉네임</Text>
      <View className="relative my-3 h-[45px] w-full">
        <TextInput
          className="h-full w-full rounded-[4px] border-[1px] border-[#D1D3D8] bg-white px-4 pr-10"
          placeholder="닉네임을 입력해주세요."
          placeholderTextColor="#9CA3AF"
          onChangeText={setInputNickname}
          value={inputNickname}
        />
        {inputNickname.length > 0 && (
          <Pressable
            onPress={() => setInputNickname("")}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <XIcon size={20} />
          </Pressable>
        )}
      </View>
      {inputNickname.length > 0 ? null : (
        <Text className="text-[12px] text-[#DC0000]">
          닉네임을 입력해주세요!
        </Text>
      )}
    </View>
  );
}
