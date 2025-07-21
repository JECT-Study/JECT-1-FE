import { Tabs, usePathname } from "expo-router";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HapticTab } from "@/components/HapticTab";
import { TabColors } from "@/constants/Colors";
import { ROUTES } from "@/constants/Routes";
import { TAB_SCREENS } from "@/constants/TabScreens";

export default function TabLayout() {
  const pathname = usePathname();

  // 탭 활성화 상태를 판별하는 함수
  const isTabActive = (screen: { activePage?: string; name: string }) => {
    if (screen.activePage) {
      // activeGroup이 정의된 경우, 해당 그룹 경로로 시작하는지 확인
      return pathname?.startsWith(`/${screen.activePage}`);
    } else if (screen.name === "index") {
      return pathname === ROUTES.HOME;
    } else {
      // activeGroup이 없는 경우, 해당 탭 경로와 정확히 일치하는지 확인
      return pathname === `/${screen.name}`;
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#ffffff" }}
      edges={["bottom"]}
    >
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
          tabBarActiveTintColor: TabColors.active,
          tabBarInactiveTintColor: TabColors.inactive,
        }}
      >
        {TAB_SCREENS.map((screen) => {
          if (screen.href === null) {
            return (
              <Tabs.Screen
                key={screen.name}
                name={screen.name}
                options={{ href: null }}
              />
            );
          }

          // 일반 탭 또는 그룹 탭 처리
          return (
            <Tabs.Screen
              key={screen.name}
              name={screen.name}
              options={{
                title: screen.title,
                tabBarIcon: ({ size }) => {
                  const isActive = isTabActive(screen);
                  const color = isActive
                    ? TabColors.active
                    : TabColors.inactive;
                  return <screen.Icon color={color} size={size} />;
                },
                tabBarLabel: ({ focused }) => {
                  const isActive = isTabActive(screen);
                  const color = isActive
                    ? TabColors.active
                    : TabColors.inactive;
                  return (
                    <Text
                      style={{
                        fontSize: 11,
                        color: color,
                        lineHeight: 11, // 웹 렌더링 호환성을 위한 설정
                      }}
                    >
                      {screen.title}
                    </Text>
                  );
                },
              }}
            />
          );
        })}
      </Tabs>
    </SafeAreaView>
  );
}
