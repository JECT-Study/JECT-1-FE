const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const {
  wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config");

// 기본 Expo 설정 불러오기
let config = getDefaultConfig(__dirname);

// NativeWind 적용
config = withNativeWind(config, {
  input: "./global.css", // ✅ 웹에서만 사용됨
});

// Reanimated 설정 적용 (마지막에 wrap!)
module.exports = wrapWithReanimatedMetroConfig(config);
