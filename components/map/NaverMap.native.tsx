import {
  NaverMapMarkerOverlay,
  NaverMapView,
} from "@mj-studio/react-native-naver-map";
import { View } from "react-native";

import LocationMarkerIcon from "@/components/icons/LocationMarkerIcon";

export default function NaverMapNative({ mapKey }: { mapKey: number }) {
  return (
    <View className="mb-3 h-48 overflow-hidden rounded-lg">
      <NaverMapView
        key={mapKey} // 지도 리셋을 위한 key
        style={{ width: "100%", height: "100%" }}
        initialCamera={{
          latitude: 37.566535,
          longitude: 126.9779692,
          zoom: 15,
        }}
        isShowLocationButton={false}
        isShowZoomControls={false}
      >
        <NaverMapMarkerOverlay
          latitude={37.566535}
          longitude={126.9779692}
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
