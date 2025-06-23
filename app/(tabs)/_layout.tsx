import { Tabs } from "expo-router";

import { HapticTab } from "@/components/HapticTab";

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
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "검색",
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: "일정",
        }}
      />
      <Tabs.Screen
        name="my"
        options={{
          title: "마이",
        }}
      />
      <Tabs.Screen
        name="jiwoong"
        options={{
          title: "Jiwoong",
          // tabBarIcon: ({ color }) => (
          //   <IconSymbol size={28} name="paperplane.fill" color={color} />
          // ),
        }}
      />
    </Tabs>
  );
}
