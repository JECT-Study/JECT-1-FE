import { Pressable, Text } from "react-native";

import { testerLogin } from "@/features/auth/testerLogin";

interface TesterLoginProps {
  disabled?: boolean;
}

export default function TesterLogin({ disabled = false }: TesterLoginProps) {
  return (
    <Pressable
      onPress={disabled ? undefined : testerLogin}
      disabled={disabled}
      className={`mx-auto w-full flex-row items-center justify-center gap-2 rounded-xl bg-gray-500 px-6 py-4 ${
        disabled ? "opacity-50" : "active:opacity-80"
      }`}
    >
      <Text className="text-white">For Test</Text>
    </Pressable>
  );
}
