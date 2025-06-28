import { Tabs, usePathname } from "expo-router";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HapticTab } from "@/components/HapticTab";
import HomeIcon from "@/components/icons/HomeIcon";
import MyIcon from "@/components/icons/MyIcon";
import ScheduleIcon from "@/components/icons/ScheduleIcon";
import SearchIcon from "@/components/icons/SearchIcon";

export default function TabLayout() {
  const pathname = usePathname();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            paddingBottom: 10,
            paddingTop: 5,
            height: 60,
          },
          tabBarIconStyle: {
            marginBottom: 3,
          },
          tabBarLabelStyle: {
            fontSize: 11,
          },
          tabBarActiveTintColor: "#816BFF",
          tabBarInactiveTintColor: "#9CA3AF",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "홈",
            tabBarIcon: ({ color, size }) => (
              <HomeIcon color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "검색",
            tabBarIcon: ({ color, size }) => (
              <SearchIcon color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="schedule"
          options={{
            title: "일정 별 컨텐츠",
            tabBarIcon: ({ color, size }) => (
              <ScheduleIcon color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="my/index"
          options={{
            title: "마이페이지",
            tabBarIcon: ({ size }) => {
              const isActive = pathname?.startsWith("/my");
              const color = isActive ? "#816BFF" : "#9CA3AF";
              return <MyIcon color={color} size={size} />;
            },
            tabBarLabel: () => {
              const isActive = pathname?.startsWith("/my");
              const color = isActive ? "#816BFF" : "#9CA3AF";
              return <Text style={{ fontSize: 11, color }}>마이페이지</Text>;
            },
          }}
        />
        <Tabs.Screen
          name="my/terms"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
