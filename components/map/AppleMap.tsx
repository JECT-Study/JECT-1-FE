import { AppleMaps } from "expo-maps";
import { View } from "react-native";

export interface AppleMapProps {
  latitude?: number;
  longitude?: number;
}

export default function AppleMap({ latitude, longitude }: AppleMapProps) {
  // 기본값 설정 (서울 시청)
  const lat = latitude || 37.5666805;
  const lng = longitude || 126.9784147;

  return (
    <View className="mb-5 h-48 w-full overflow-hidden rounded-lg">
      <AppleMaps.View
        style={{ flex: 1 }}
        cameraPosition={{
          coordinates: {
            latitude: lat,
            longitude: lng,
          },
          zoom: 17,
        }}
        markers={[
          {
            coordinates: {
              latitude: lat,
              longitude: lng,
            },
          },
        ]}
      />
    </View>
  );
}
