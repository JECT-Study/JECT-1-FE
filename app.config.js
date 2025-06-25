export default ({ config }) => ({
  ...config,
  name: "JECT-1-FE",
  slug: "JECT-1-FE",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "ject1fe",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    usesAppleSignIn: true,
    bundleIdentifier: process.env.bundleIdentifier,
    infoPlist: {
      LSApplicationQueriesSchemes: [
        "kakaokompassauth",
        "kakaolink",
        "kakaoplus",
      ],
      CFBundleURLTypes: [
        {
          CFBundleURLSchemes: [`kakao${process.env.KAKAO_NATIVE_APP_KEY}`],
        },
      ],
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    edgeToEdgeEnabled: true,
    package: process.env.package,
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
          ],
        },
      },
    ],
    [
      "@react-native-kakao/core",
      {
        nativeAppKey: process.env.KAKAO_NATIVE_APP_KEY,
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
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    storybookEnabled: process.env.STORYBOOK_ENABLED,
    kakaoNativeAppKey: process.env.KAKAO_NATIVE_APP_KEY,
  },
});
