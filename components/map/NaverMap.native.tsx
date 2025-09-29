import {
  NaverMapMarkerOverlay,
  NaverMapView,
} from "@mj-studio/react-native-naver-map";
import { View } from "react-native";

import LocationMarkerIcon from "@/components/icons/LocationMarkerIcon";

import { NaverMapProps } from "./NaverMap";

export default function NaverMapNative({
  latitude = 37.566535,
  longitude = 126.9779692,
}: NaverMapProps) {
  return (
    <View className="h-48 overflow-hidden rounded-lg">
      <NaverMapView
        style={{ width: "100%", height: "100%" }}
        initialCamera={{
          latitude: latitude,
          longitude: longitude,
          zoom: 15,
        }}
        isShowLocationButton={false}
        isShowZoomControls={false}
      >
        <NaverMapMarkerOverlay
          latitude={latitude}
          longitude={longitude}
          width={30}
          height={34}
          anchor={{ x: 0.5, y: 1 }}
        >
          <LocationMarkerIcon width={30} height={34} />
        </NaverMapMarkerOverlay>
      </NaverMapView>
    </View>
  );
}
