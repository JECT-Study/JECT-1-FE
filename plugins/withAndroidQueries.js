const { withAndroidManifest } = require("@expo/config-plugins");

const withAndroidQueries = (config) => {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;
    const { manifest } = androidManifest;

    // queries 태그가 없으면 생성
    if (!manifest.queries) {
      manifest.queries = [];
    }

    // 네이버 지도 패키지 추가
    const naverMapPackage = {
      package: [{ $: { "android:name": "com.nhn.android.nmap" } }],
    };

    // 이미 존재하는지 확인
    const existingQueries = manifest.queries[0];
    if (!existingQueries) {
      manifest.queries[0] = naverMapPackage;
    } else if (!existingQueries.package) {
      existingQueries.package = naverMapPackage.package;
    } else {
      const hasNaverMap = existingQueries.package.some(
        (pkg) => pkg.$["android:name"] === "com.nhn.android.nmap",
      );
      if (!hasNaverMap) {
        existingQueries.package.push({
          $: { "android:name": "com.nhn.android.nmap" },
        });
      }
    }

    return config;
  });
};

module.exports = withAndroidQueries;
