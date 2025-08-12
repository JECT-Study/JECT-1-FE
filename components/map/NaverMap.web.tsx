import { useEffect } from "react";

import Constants from "expo-constants";
import { View } from "react-native";

import { NaverMapProps } from "./NaverMap";

declare global {
  interface Window {
    naver: any;
  }
}

export default function NaverMapWeb({
  latitude = 37.5665,
  longitude = 126.978,
}: NaverMapProps) {
  const sdkUrl = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${Constants.expoConfig?.extra?.NAVER_MAP_CLIENT_ID}`;
  const renderMap = () => {
    const map = new window.naver.maps.Map("map", {
      center: new window.naver.maps.LatLng(latitude, longitude),
      zoom: 15,
    });

    new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(latitude, longitude),
      map,
    });
  };

  useEffect(() => {
    const existingScript = document.querySelector(`script[src="${sdkUrl}"]`);
    if (existingScript) {
      if (window.naver?.maps) {
        renderMap();
      }
      return;
    }

    const script = document.createElement("script");
    script.src = sdkUrl;
    script.async = true;
    script.onload = () => {
      if (window.naver?.maps) {
        renderMap();
      }
    };
    document.head.appendChild(script);
  }, [sdkUrl, latitude, longitude]);
  return (
    <View className="mb-3 h-48 overflow-hidden rounded-lg">
      <View
        id="map"
        style={{ width: "100%", height: "100%", borderRadius: 12 }}
      />
    </View>
  );
}
