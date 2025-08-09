import { useEffect } from "react";

import axios, { AxiosError } from "axios";
import { router } from "expo-router";
import { SafeAreaView, View, Text } from "react-native";

import CustomHeader from "@/components/ui/CustomHeader";
import { UsersScheduleUrl } from "@/constants/ApiUrls";

export default function Plan() {
  useEffect(() => {
    const getSchedule = async () => {
      try {
        const response = await axios(`${UsersScheduleUrl}/check`, {
          params: {
            month: "2025-06", // TODO: 실제 날짜로 변경
          },
        });
        console.log(response);
      } catch (e) {
        const axiosError = e as AxiosError;
        console.error(axiosError);
      }
    };
    getSchedule();
    // test
  }, []);

  return (
    <>
      <SafeAreaView className="w-full flex-1 bg-white">
        <CustomHeader
          title="나의 일정"
          isCommit={false}
          cancel={() => router.replace("/my")}
        />
        <View>
          <Text>해당 위치에 달력 컴포넌트를 활용</Text>
          <Text>컨텐츠 일정과 동일한 구성, 데이터만 달리</Text>
        </View>
      </SafeAreaView>
    </>
  );
}
