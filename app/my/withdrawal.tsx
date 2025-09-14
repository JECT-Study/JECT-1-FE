import { router } from "expo-router";
import { Pressable, SafeAreaView, Text, TextInput, View } from "react-native";
import Animated from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

import CustomHeader from "@/components/ui/CustomHeader";
import Separator from "@/components/ui/Separator";
import { reason } from "@/constants/WithDrawal";
import { withdraw } from "@/features/auth/withdraw";
import useWithDrawForm from "@/hooks/useWithDrawForm";

export default function Withdrawal() {
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
    <SafeAreaView className="w-full flex-1 bg-white">
      <CustomHeader
        title="회원탈퇴"
        isCommit={false}
        separator
        cancel={() => router.back()}
      />
      <View className="flex-1 px-4">
        <Text className="my-7 text-xl font-medium">
          서비스를 탈퇴하는 이유가 궁금해요.
        </Text>

        <View className="relative flex-1">
          <View className="z-50 mb-4 w-full overflow-hidden rounded-xl border border-[#757575]">
            <Pressable
              onPress={toggle}
              className="flex h-16 flex-row items-center justify-between bg-white px-4 py-3"
            >
              {selected === null ? (
                <Text className="text-base text-[#BDBDBD]">
                  탈퇴 사유를 선택해주세요
                </Text>
              ) : (
                <Text className="text-base text-[#212121]">{selected}</Text>
              )}
              <Animated.View style={animatedArrowRotation}>
                <Svg width="16" height="17" viewBox="0 0 16 17" fill="none">
                  <Path
                    d="M7.76314 11L12.5263 6.5H3L7.76314 11Z"
                    fill="#BDBDBD"
                  />
                </Svg>
              </Animated.View>
            </Pressable>

            <Animated.View style={animatedStyle}>
              <View onLayout={onLayoutContent} className="bg-white pt-px">
                <Separator color="#757575" />
                {reason.map((item, index) => (
                  <Pressable
                    key={item}
                    onPress={() => {
                      setSelected(item);
                      toggle();
                    }}
                    className={`flex h-14 justify-center bg-white px-4 py-3 ${index !== reason.length - 1 ? "border-b-[1px] border-[#D9D9D9]" : ""}`}
                  >
                    <Text className="text-base text-[#212121]">{item}</Text>
                  </Pressable>
                ))}
              </View>
            </Animated.View>
          </View>

          <View className="absolute top-[80px] z-10 w-full">
            {selected === "기타" && (
              <TextInput
                placeholder="회원탈퇴 이유를 알려주세요."
                placeholderTextColor="#BDBDBD"
                className="h-[158px] w-full rounded-lg border-[1px] border-[#757575] bg-white p-4"
                onChangeText={setOtherReason}
                value={otherReason}
                multiline
                textAlignVertical="top"
              />
            )}
          </View>

          <View
            className={`absolute ${selected === "기타" ? "top-[250px]" : "top-[96px]"}`}
          >
            <Text className="text-base font-normal text-[#424242]">
              소중한 의견을 반영하여
            </Text>
            <Text className="text-base font-normal text-[#424242]">
              더 좋은 서비스로 보답하겠습니다.
            </Text>
          </View>
        </View>

        <View className="pb-8">
          <Pressable
            className={`flex h-[45px] w-full items-center justify-center rounded-lg ${
              checkSubmit() ? "bg-[#6C4DFF]" : "bg-[#E0E0E0]"
            }`}
            onPress={async () => {
              if (checkSubmit()) {
                console.log("이유", selected);
                console.log("상세 이유", otherReason);
                try {
                  await withdraw();
                } catch (error) {
                  console.error("회원탈퇴 실패:", error);
                }
              }
            }}
          >
            <Text className="text-center text-lg font-semibold text-white">
              제출
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
