import { router } from "expo-router";
import { Pressable, Text } from "react-native";

interface TesterLoginProps {
  disabled?: boolean;
}

export default function TesterLogin({ disabled = false }: TesterLoginProps) {
  const handleTesterLogin = () => {
    // 설문조사 페이지로 이동
    router.push("/survey");
  };

  return (
    <Pressable
      onPress={disabled ? undefined : handleTesterLogin}
      disabled={disabled}
      className={`mx-auto w-full flex-row items-center justify-center gap-2 rounded-xl bg-[#6C4DFF] px-6 py-3 ${
        disabled ? "opacity-50" : "active:opacity-80"
      }`}
    >
      <Text className="text-base text-white">설문조사 후 시작하기</Text>
    </Pressable>
  );
}
