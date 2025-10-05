import { AppleMaps } from "expo-maps";
import { View } from "react-native";

export interface AppleMapProps {
  latitude?: number;
  longitude?: number;
}

export default function AppleMap({
  latitude = 37.566535,
  longitude = 126.9779692,
}: AppleMapProps) {
  return (
    <View className="h-48 w-full overflow-hidden rounded-lg">
      <AppleMaps.View
        style={{ flex: 1 }}
        cameraPosition={{
          coordinates: {
            latitude,
            longitude,
          },
          zoom: 17,
        }}
        markers={[
          {
            coordinates: {
              latitude,
              longitude,
            },
          },
        ]}
      />
    </View>
  );
}
