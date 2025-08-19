import { Pressable, Text, TextInput, View } from "react-native";
import Animated from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

import Separator from "@/components/ui/Separator";
import { withdraw } from "@/features/auth/withdraw";
import useWithDrawForm from "@/hooks/useWithDrawForm";

type AccordionProps = {
  title: string;
  items: string[];
};

export default function WithDrawForm({ title, items }: AccordionProps) {
  const {
    toggle,
    selected,
    setSelected,
    animatedArrowRotation,
    animatedStyle,
    onLayoutContent,
    setOtherReason,
    otherReason,
    checkSubmit,
  } = useWithDrawForm();
  return (
    <>
      <View className="relative flex-1">
        <View className="mb-4 w-full overflow-hidden rounded-xl border border-[#757575]">
          <Pressable
            onPress={toggle}
            className="flex h-[60px] flex-row items-center justify-between bg-white px-4 py-3"
          >
            {selected === null ? (
              <Text className="text-[14px] text-base font-[400px] text-[#767676]">
                {title}
              </Text>
            ) : (
              <Text className="text-[14px] text-base font-[400px] text-[#111111]">
                {selected}
              </Text>
            )}
            <Animated.View style={animatedArrowRotation}>
              <Svg width="16" height="17" viewBox="0 0 16 17" fill="none">
                <Path
                  d="M7.76314 11L12.5263 6.5H3L7.76314 11Z"
                  fill="#D9D9D9"
                />
              </Svg>
            </Animated.View>
          </Pressable>
          <Animated.View style={animatedStyle}>
            <View onLayout={onLayoutContent} className="bg-white pt-2">
              <Separator color="#757575" />
              {items.map((item, index) => (
                <Pressable
                  key={item}
                  onPress={() => {
                    setSelected(item);
                    toggle();
                  }}
                  className={`bg-white px-2 py-4 ${index !== items.length - 1 ? "border-b-[1px] border-[#D9D9D9]" : ""}`}
                >
                  <Text className="text-[14px] font-[400px] leading-[150%] text-[#111111]">
                    {item}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Animated.View>
        </View>
        {selected === "기타" ? (
          <TextInput
            placeholder="회원 탈퇴 이유를 알려주세요."
            className="h-[158px] rounded-lg border-[1px] border-[#757575] bg-white p-4"
            onChangeText={setOtherReason}
            value={otherReason}
            multiline
            textAlignVertical="top"
          />
        ) : null}
        <View className="absolute top-[80px] -z-50">
          <Text className="mt-4 text-[14px] font-normal text-[#484848]">
            소중한 의견을 반영하여
          </Text>
          <Text className="text-[14px] font-normal text-[#484848]">
            더 좋은 서비스로 보답하겠습니다.
          </Text>
        </View>
      </View>
      <Pressable
        className={`w-full rounded-lg py-4 ${
          checkSubmit() ? "bg-[#816BFF]" : "bg-[#D1C9FF]"
        }`}
        onPress={async () => {
          if (checkSubmit()) {
            try {
              await withdraw();
            } catch (error) {
              console.error("회원탈퇴 실패:", error);
            }
          }
        }}
      >
        <Text className="text-center text-[16px] font-semibold text-white">
          제출
        </Text>
      </Pressable>
    </>
  );
}
