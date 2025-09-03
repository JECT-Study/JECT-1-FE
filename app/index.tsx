import { useCallback, useEffect, useState } from "react";

import { Marquee } from "@animatereactnative/marquee";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Platform, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AppleIcon from "@/components/icons/AppleIcon";
import KakaoIcon from "@/components/icons/KakaoIcon";
import { loginImages, LoginImageType } from "@/constants/LoginImages";
import { AndroidAppleLogin, IOSAppleLogin } from "@/features/auth/appleLogin";
import { initializeKakao, kakaoLogin } from "@/features/auth/kakaoLogin";

function LoginMarquee({
  imageList,
  direction,
}: {
  imageList: LoginImageType;
  direction: "down" | "up";
}) {
  const speed = direction === "down" ? -0.3 : 0.3;
  return (
    <Marquee direction="vertical" speed={speed} withGesture={false}>
      {imageList.map((imageInfo) => {
        const imageName = imageInfo[0];
        const imageSrc = imageInfo[1];
        return (
          <View
            key={imageName}
            className="my-2 flex h-[213px] w-[158px] items-center justify-center overflow-hidden rounded-[26px]"
          >
            <Image
              source={imageSrc}
              style={{ width: "100%", height: "100%", opacity: 0.3 }}
              contentFit="cover"
            />
          </View>
        );
      })}
    </Marquee>
  );
}

function LoginCardSlider() {
  const images = Object.entries(loginImages);
  const leftImages = images.splice(0, Math.floor(images.length / 2));

  return (
    <View className="flex flex-1 flex-row">
      <LoginMarquee imageList={leftImages} direction={"up"} />
      <View className="m-2" />
      <LoginMarquee imageList={images} direction={"down"} />
    </View>
  );
}

function KakaoLogin({ disabled = false }: { disabled?: boolean }) {
  useEffect(() => {
    initializeKakao();
  }, []);

  return (
    <Pressable
      onPress={disabled ? undefined : kakaoLogin}
      disabled={disabled}
      className={`mx-auto h-14 w-full flex-row items-center justify-center gap-2 rounded-xl bg-[#F9DB00] px-6 ${
        disabled ? "opacity-50" : "active:opacity-80"
      }`}
    >
      <KakaoIcon size={20} color="#3E1918" />
      <Text className="text-lg font-medium text-black">
        카카오톡으로 시작하기
      </Text>
    </Pressable>
  );
}

function AppleLogin({ disabled = false }: { disabled?: boolean }) {
  const handlePress =
    Platform.OS === "android" ? AndroidAppleLogin : IOSAppleLogin;

  return (
    <Pressable
      onPress={disabled ? undefined : handlePress}
      disabled={disabled}
      className={`mx-auto h-14 w-full flex-row items-center justify-center gap-2 rounded-xl bg-white px-6 ${
        disabled ? "opacity-50" : "active:opacity-80"
      }`}
    >
      <AppleIcon size={20} color="black" />
      <Text className="text-lg font-medium text-black">Apple로 시작하기</Text>
    </Pressable>
  );
}

export default function Login() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isIOS = Platform.OS === "ios";

  useFocusEffect(
    useCallback(() => {
      const checkTokens = async () => {
        try {
          const accessToken = await SecureStore.getItemAsync("accessToken");
          const refreshToken = await SecureStore.getItemAsync("refreshToken");

          if (accessToken && refreshToken) {
            setIsLoggedIn(true);
            router.push("/(tabs)");
          } else {
            setIsLoggedIn(false);
            console.log("토큰 없음 - 로그인 화면 유지");
          }
        } catch (error) {
          console.error("토큰 확인 실패:", error);
          setIsLoggedIn(false);
        }
      };
      checkTokens();
    }, [router, setIsLoggedIn]),
  );

  return (
    <View className="flex-1 items-center bg-black">
      <LoginCardSlider />
      <View className="items-center">
        <Text className="text-[34px] font-semibold text-white">마이코드</Text>
        <Text className="text-[18px] text-white">
          나에게 맞는 컨텐츠를 한눈에
        </Text>
      </View>

      <View className="w-full">
        <LinearGradient
          colors={["transparent", "black"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{ height: 282, width: "100%" }}
          pointerEvents="none"
        />
        <View className="bg-[#010101] px-4">
          <View className="mb-6 w-full items-center">
            <KakaoLogin disabled={isLoggedIn} />
            <View className="my-2" />
            {isIOS ? <AppleLogin disabled={isLoggedIn} /> : null}
            {isIOS ? <View className="my-2" /> : null}
          </View>

          <View className="flex-col items-center justify-center gap-y-4">
            <Pressable
              onPress={() => router.push("/(tabs)")}
              className="flex-row items-center justify-center px-6"
            >
              <Text className="text-[16px] text-[#AAAAAA] underline underline-offset-4">
                둘러보기
              </Text>
            </Pressable>
          </View>
          <View className="m-4" />
          <View style={{ marginBottom: insets.bottom - 1 }} />
        </View>
      </View>
    </View>
  );
}
