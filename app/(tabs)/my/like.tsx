import { router } from "expo-router";
import { RefreshControl, SafeAreaView, ScrollView, View } from "react-native";

import LikeFilter from "@/components/mypage/LikeFilter";
import CustomHeader from "@/components/ui/CustomHeader";
import PostBlock from "@/components/ui/PostBlock";
import useLikeRefresh from "@/hooks/useLikeRefresh";

const infodummy = [
  {
    id: 0,
    img_url: "",
    title:
      "매우긴이름예시매우긴이름예시매우긴이름예시매우긴이름예시매우긴이름예시",
    address:
      "서울특별시 1서울특별시 1서울특별시 1서울특별시 1서울특별시 1서울특별시 1",
    start_date: "2024.01.01",
    end_date: "2024.01.30",
  },
  {
    id: 1,
    img_url: "",
    title: "JECT 피자챗1",
    address: "서울특별시 1",
    start_date: "2024.01.01",
    end_date: "2024.01.30",
  },
  {
    id: 2,
    img_url: "",
    title: "JECT 피자챗2",
    address: "서울특별시 2",
    start_date: "2024.01.01",
    end_date: "2024.01.30",
  },
  {
    id: 3,
    img_url: "",
    title: "JECT 피자챗3",
    address: "서울특별시 3",
    start_date: "2024.01.01",
    end_date: "2024.01.30",
  },
  {
    id: 4,
    img_url: "",
    title: "JECT 피자챗4",
    address: "서울특별시 4",
    start_date: "2024.01.01",
    end_date: "2024.01.30",
  },
  {
    id: 5,
    img_url: "",
    title: "JECT 피자챗5",
    address: "서울특별시 5",
    start_date: "2024.01.01",
    end_date: "2024.01.30",
  },
  {
    id: 6,
    img_url: "",
    title: "JECT 피자챗6",
    address: "서울특별시 6",
    start_date: "2024.01.01",
    end_date: "2024.01.30",
  },
  {
    id: 7,
    img_url: "",
    title: "JECT 피자챗7",
    address: "서울특별시 7",
    start_date: "2024.01.01",
    end_date: "2024.01.30",
  },
  {
    id: 8,
    img_url: "",
    title: "JECT 피자챗8",
    address: "서울특별시 8",
    start_date: "2024.01.01",
    end_date: "2024.01.30",
  },
];

export default function Like() {
  const { refresh, onRefresh } = useLikeRefresh();
  return (
    <SafeAreaView className="w-full flex-1 items-center bg-white">
      <CustomHeader
        title="관심 목록"
        isCommit={false}
        cancel={() => {
          router.replace("/my");
        }}
      />
      <View className="flex w-full items-start p-6">
        <LikeFilter />
      </View>
      <ScrollView
        className="w-full flex-1 px-6 py-2"
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }
      >
        {infodummy.map((item) => {
          return <PostBlock info={item} key={item.id} />;
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
