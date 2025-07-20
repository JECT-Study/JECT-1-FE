import { shareFeedTemplate } from "@react-native-kakao/share";
import { Stack, useLocalSearchParams } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function DetailScreen() {
  const { id } = useLocalSearchParams();

  const handleKakaoShare = async () => {
    try {
      await shareFeedTemplate({
        template: {
          content: {
            title: "마이코드",
            description: "이번달 핫한 축제 🔥",
            imageUrl:
              "https://mfnmcpsoimdf9o2j.public.blob.vercel-storage.com/detail-dummy.png",
            link: {
              webUrl: "https://github.com/",
              mobileWebUrl: "https://github.com/",
            },
          },
          buttons: [
            {
              title: "앱에서 보기",
              link: {
                webUrl: "https://github.com/",
                mobileWebUrl: "https://github.com/",
              },
            },
            {
              title: "웹에서 보기",
              link: {
                webUrl: "https://github.com/kimdonggu42",
                mobileWebUrl: "https://github.com/kimdonggu42",
              },
            },
          ],
        },
      });
    } catch (error) {
      console.error("카카오톡 공유 오류:", error);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerShadowVisible: false,
        }}
      />
      <ThemedView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center px-4">
          <ThemedText
            type="subtitle"
            className="mb-8 text-center text-gray-600"
          >
            ID: {id}
          </ThemedText>

          <Pressable
            onPress={handleKakaoShare}
            className="w-full max-w-sm rounded-lg bg-yellow-400 px-6 py-3 shadow-lg active:bg-yellow-500"
          >
            <Text className="text-center text-lg font-semibold text-black">
              카카오톡으로 공유하기
            </Text>
          </Pressable>

          <Text className="mt-4 text-center text-sm text-gray-500">
            GitHub 프로필을 카카오톡으로 공유해보세요
          </Text>
        </View>
      </ThemedView>
    </>
  );
}
