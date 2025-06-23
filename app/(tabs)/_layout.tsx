import { Tabs } from "expo-router";

import { HapticTab } from "@/components/HapticTab";
import HomeIcon from "@/components/icons/HomeIcon";
import MyIcon from "@/components/icons/MyIcon";
import ScheduleIcon from "@/components/icons/ScheduleIcon";
import SearchIcon from "@/components/icons/SearchIcon";

export default function TabLayout() {
  return (
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
        name="my"
        options={{
          title: "마이페이지",
          tabBarIcon: ({ color, size }) => <MyIcon color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
