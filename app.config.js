import "dotenv/config";

export default {
  name: "mycode",
  slug: "mycode",
  owner: "scorchedrice",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "mycode",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,

  ios: {
    supportsTablet: true,
    usesAppleSignIn: true,
    bundleIdentifier: process.env.MYCODE_BUNDLE_IDENTIFIER,
    infoPlist: {
      LSApplicationQueriesSchemes: [
        "kakaokompassauth",
        "kakaolink",
        "kakaoplus",
      ],
      CFBundleURLTypes: [
        {
          CFBundleURLSchemes: [
            `kakao${process.env.MYCODE_KAKAO_NATIVE_APP_KEY}`,
          ],
        },
      ],
      NSAppTransportSecurity: { NSAllowsArbitraryLoads: true },
    },
  },

  android: {
    package: process.env.MYCODE_PACKAGE,
    edgeToEdgeEnabled: true,
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
  },

  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },

  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    ],
    [
      "expo-build-properties",
      {
        android: {
          extraMavenRepos: [
            "https://devrepo.kakao.com/nexus/content/groups/public/",
            "https://repository.map.naver.com/archive/maven",
          ],
          usesCleartextTraffic: true,
        },
      },
    ],
    [
      "@react-native-kakao/core",
      {
        nativeAppKey: process.env.MYCODE_KAKAO_NATIVE_APP_KEY,
        android: {
          authCodeHandlerActivity: true,
        },
        ios: {
          handleKakaoOpenUrl: true,
        },
      },
    ],
    "expo-apple-authentication",
    [
      "expo-image-picker",
      {
        photosPermission: "마이코드가 당신의 사진(앱)에 접근하려합니다.",
        cameraPermission: "마이코드가 당신의 카메라(앱)에 접근하려합니다.",
      },
    ],
    [
      "@mj-studio/react-native-naver-map",
      {
        client_id: process.env.NAVER_MAP_CLIENT_ID,
      },
    ],
  ],

  experiments: {
    typedRoutes: true,
  },

  extra: {
    storybookEnabled: process.env.STORYBOOK_ENABLED,
    kakaoNativeAppKey: process.env.MYCODE_KAKAO_NATIVE_APP_KEY,
    BACKEND_URL: process.env.MYCODE_BACKEND_URL,
    eas: {
      projectId: process.env.MYCODE_EAS_PROJECT_ID,
    },
  },
};
