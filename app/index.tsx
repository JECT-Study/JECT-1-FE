import { useCallback, useEffect, useState } from "react";

import { Marquee } from "@animatereactnative/marquee";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { setStatusBarStyle } from "expo-status-bar";
import { Platform, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AppleIcon from "@/components/icons/AppleIcon";
import KakaoIcon from "@/components/icons/KakaoIcon";
import MyCodeLogo from "@/components/icons/MyCodeLogo";
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
            className="my-2 flex h-[240px] w-[176px] items-center justify-center overflow-hidden rounded-[26px]"
          >
            <Image
              source={imageSrc}
              style={{ width: "100%", height: "100%", opacity: 1 }}
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
      className={`relative mx-auto h-16 w-full flex-row items-center justify-center rounded-xl bg-[#FEE700] px-6 ${
        disabled ? "opacity-50" : "active:opacity-80"
      }`}
    >
      <View className="absolute left-6">
        <KakaoIcon size={20} color="#3E1918" />
      </View>
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
      className={`relative mx-auto h-16 w-full flex-row items-center justify-center rounded-xl bg-[#F6F6F9] px-6 ${
        disabled ? "opacity-50" : "active:opacity-80"
      }`}
    >
      <View className="absolute left-6">
        <AppleIcon size={20} color="black" />
      </View>
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
        setStatusBarStyle("light");

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
    <View className="flex-1 items-center bg-white">
      <LoginCardSlider />
      <View className="absolute inset-0 bg-black/80" />
      <View className="absolute top-1/3 z-10 flex -translate-y-1/2 items-center gap-y-2">
        <MyCodeLogo width={180} height={44} />
        <Text className="text-lg font-medium text-white">
          내 코드에 딱 맞는 문화생활, 마이코드에서
        </Text>
      </View>

      <View className="z-10 w-full">
        <LinearGradient
          colors={[
            "rgba(85, 85, 85, 0)",
            "rgba(85, 85, 85, 0.5)",
            "rgba(85, 85, 85, 0.8)",
            "rgba(85, 85, 85, 0.95)",
            "#555555",
          ]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{ height: 60, width: "100%" }}
          pointerEvents="none"
        />
        <View className="bg-[#555555] px-5">
          <View className="mb-6 w-full items-center">
            <KakaoLogin disabled={isLoggedIn} />
            <View className="my-2" />
            {isIOS && <AppleLogin disabled={isLoggedIn} />}
          </View>

          <Pressable
            onPress={() => router.push("/(tabs)")}
            className="flex-row items-center justify-center px-6"
          >
            <View className="items-center">
              <Text className="text-lg text-[#F4F4F4]">둘러보기</Text>
              <View className="h-px w-full bg-[#F4F4F4]" />
            </View>
          </Pressable>
          <View className="m-6" />
          <View style={{ marginBottom: insets.bottom - 1 }} />
        </View>
      </View>
    </View>
  );
}
