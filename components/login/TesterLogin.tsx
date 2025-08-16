import { Pressable, Text } from "react-native";

import { testerLogin } from "@/features/auth/testerLogin";

export default function TesterLogin() {
  return (
    <Pressable
      onPress={testerLogin}
      className="mx-auto w-full max-w-[500px] flex-row items-center justify-center gap-2 rounded-xl bg-gray-500 px-6 py-4 active:opacity-80"
    >
      <Text className="text-white">For Test</Text>
    </Pressable>
  );
}
