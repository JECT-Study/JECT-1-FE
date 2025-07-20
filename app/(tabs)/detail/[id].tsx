import { shareFeedTemplate } from "@react-native-kakao/share";
import { Stack, useRouter } from "expo-router";
import {
  Animated,
  Dimensions,
  Image,
  Pressable,
  StatusBar,
  Text,
  View,
} from "react-native";

import BackArrow from "@/components/icons/BackArrow";
import CopyIcon from "@/components/icons/CopyIcon";
import HeartOutlineIcon from "@/components/icons/HeartOutlineIcon";
import LocationIcon from "@/components/icons/LocationIcon";
import LocationPinIcon from "@/components/icons/LocationPinIcon";
import ShareOutlineIcon from "@/components/icons/ShareOutlineIcon";
import { ROUTES } from "@/constants/Routes";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const IMAGE_HEIGHT = SCREEN_HEIGHT * 0.4;

function Divider({ height = "h-px", bg = "bg-[#F0F0F0]" }) {
  return <View className={`w-full ${height} ${bg}`} />;
}

export default function DetailScreen() {
  const router = useRouter();

  const scrollY = new Animated.Value(0);

  const handleKakaoShare = async () => {
    try {
      await shareFeedTemplate({
        template: {
          content: {
            title: "양평 수박 축제",
            description: "2025.07.05 - 2025.07.06",
            imageUrl:
              "https://mfnmcpsoimdf9o2j.public.blob.vercel-storage.com/detail-dummy.png",
            link: {
              webUrl: "https://github.com/",
              mobileWebUrl: "https://github.com/",
            },
          },
        },
      });
    } catch (error) {
      console.error("카카오톡 공유 오류:", error);
    }
  };

  const handleGoBack = () => {
    router.push(ROUTES.HOME);
  };

  // 스크롤에 따른 어두운 오버레이 투명도
  const overlayOpacity = scrollY.interpolate({
    inputRange: [0, 300],
    outputRange: [0, 0.5],
    extrapolate: "clamp",
  });

  // 스크롤에 따른 정보 영역 위치
  const contentTranslateY = scrollY.interpolate({
    inputRange: [0, 300],
    outputRange: [0, 120],
    extrapolate: "clamp",
  });

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View className="flex-1 bg-white">
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />

        {/* 상단 이미지 영역 */}
        <View
          className="absolute left-0 right-0 top-0 z-10"
          style={{
            height: IMAGE_HEIGHT,
          }}
        >
          <Image
            source={require("@/assets/images/detail-dummy.png")}
            className="w-full"
            style={{
              height: IMAGE_HEIGHT,
              resizeMode: "cover",
            }}
          />

          {/* 오버레이 */}
          <Animated.View
            className="absolute inset-0 bg-black"
            style={{
              opacity: overlayOpacity,
            }}
          />

          {/* 태그들 */}
          <View className="absolute bottom-14 left-4 flex-row gap-2">
            <View className="rounded-full bg-[#E0FFEB] px-3 py-1">
              <Text className="text-sm text-[#22A04C]">주말한정</Text>
            </View>
            <View className="rounded-full bg-[#E9F2FF] px-3 py-1">
              <Text className="text-sm text-[#4D87FF]">인원제한</Text>
            </View>
          </View>
        </View>

        <View className="absolute left-4 top-20 z-50">
          <Pressable
            onPress={handleGoBack}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <BackArrow color="#fff" />
          </Pressable>
        </View>

        {/* 스크롤 가능한 정보 영역 */}
        <Animated.ScrollView
          className="z-20 flex-1"
          style={{
            transform: [{ translateY: contentTranslateY }],
          }}
          contentContainerStyle={{
            paddingTop: IMAGE_HEIGHT - 30,
          }}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false },
          )}
          scrollEventThrottle={16}
        >
          <View
            className="rounded-t-3xl bg-white pb-40 pt-6"
            style={{ minHeight: SCREEN_HEIGHT }}
          >
            {/* 제목 섹션 */}
            <View className="mb-3 px-5">
              <View className="mb-6 flex-row items-center justify-between">
                <View className="flex-1 gap-1 pr-4">
                  <Text className="text-xl font-semibold text-gray-800">
                    양평 수박 축제
                  </Text>
                  <Text className="text-gray-800">
                    양평군 청운면 용두사장 일원
                  </Text>
                  <Text className="text-gray-800">2025.07.05 - 2025.07.06</Text>
                </View>

                <View className="flex-row gap-x-1.5">
                  <View className="flex-row items-center gap-x-1">
                    <Pressable
                      className="items-center justify-center"
                      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                    >
                      <HeartOutlineIcon size={28} />
                    </Pressable>
                    <Text className="text-lg font-medium text-gray-700">
                      24
                    </Text>
                  </View>
                  <Pressable
                    onPress={handleKakaoShare}
                    className="items-center justify-center"
                    style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                  >
                    <ShareOutlineIcon size={28} />
                  </Pressable>
                </View>
              </View>

              <View className="flex-row gap-x-3">
                <Pressable
                  className="h-12 flex-1 justify-center rounded-lg border-[0.5px] border-gray-300 p-2.5"
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                >
                  <Text className="text-center font-medium text-black">
                    전시 홈페이지
                  </Text>
                </Pressable>
                <Pressable
                  className="h-12 flex-1 justify-center rounded-lg border-[0.5px] border-[#6C4DFF] p-2.5"
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                >
                  <Text className="text-center font-medium text-[#6C4DFF]">
                    내 일정 추가
                  </Text>
                </Pressable>
              </View>
            </View>

            <Divider />

            {/* 정보 섹션 */}
            <View>
              <View className="my-5 flex-col gap-y-2 px-5">
                <View className="flex-row items-center">
                  <Text className="w-20 font-semibold text-gray-800">
                    관람시간
                  </Text>
                  <Text className="text-sm text-gray-700">10:00-18:00</Text>
                </View>

                <View className="flex-row items-center">
                  <Text className="w-20 font-semibold text-gray-800">
                    전화번호
                  </Text>
                  <Text className="text-sm text-gray-700">031-770-3232</Text>
                </View>

                <View className="flex-row items-center">
                  <Text className="w-20 font-semibold text-gray-800">주소</Text>
                  <View className="flex-row flex-wrap items-center">
                    <Text className="text-sm text-gray-700">
                      경기도 양평군 청운면 용두로 170{" "}
                    </Text>
                    <View className="flex-row items-center">
                      <CopyIcon size={14} />
                      <Text className="ml-1 text-xs text-blue-600">복사</Text>
                    </View>
                  </View>
                </View>

                <View className="flex-row">
                  <Text className="mt-0.5 w-20 font-semibold text-gray-800">
                    행사소개
                  </Text>
                  <Text className="flex-1 text-sm text-gray-700">
                    축제이다. 푸른 하늘 아래 천혜의 자연환경에서 생산된
                    양평수박은 깨끗한 물과 높은 일교차, 뜨거운 햇빛 속에서 자라
                    높은 당도와 아삭한 식감을 자랑한다. 청운면의 특산물로
                    자리잡은 고품질의 수박과 함께, 가족이 함께 즐길 수 있는
                    축제이다.
                  </Text>
                </View>
              </View>

              <Divider />

              <View className="my-5 px-5">
                <Text className="mb-3 font-semibold text-gray-800">
                  행사내용
                </Text>
                <View className="flex-row flex-wrap gap-y-1">
                  <Text className="text-gray-700">
                    1. 메인프로그램 : 양평수박 홍보 및 판매, 키원대회,
                    수박가요제, 가수 축하공연 등
                  </Text>
                  <Text className="text-gray-700">
                    2. 부대프로그램 : 수박품평회, 지역동아리 공연, 체험 등
                  </Text>
                  <Text className="text-gray-700">
                    3. 소비자 참여 프로그램 : 어린이 물놀이, 페이스페인팅,
                    네일아트, 수막만간놀이 등
                  </Text>
                  <Text className="text-gray-700">
                    4. 각종 먹거리 및 지역특산물 판매장 운영
                  </Text>
                </View>
              </View>

              <Divider height="h-2" bg="bg-[#F5F5F5]" />

              <View className="my-5 px-5">
                <Text className="mb-4 text-lg font-semibold text-gray-800">
                  위치
                </Text>

                <View className="mb-3 h-48 items-center justify-center rounded-lg bg-gray-100">
                  <Text className="text-gray-500">지도 영역</Text>
                </View>

                <View className="mb-3 flex-row items-center">
                  <LocationIcon size={16} />
                  <Text className="ml-1.5 flex-1 text-sm text-black">
                    경기도 양평군 청운면 용두로 170
                  </Text>
                </View>

                <Pressable
                  className="flex flex-row items-center justify-center rounded-lg border border-black py-3"
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                >
                  <LocationPinIcon size={14} />
                  <Text className="ml-1.5 text-center font-medium text-black">
                    길찾기
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Animated.ScrollView>
      </View>
    </>
  );
}
