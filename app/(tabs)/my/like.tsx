import { useEffect, useState } from "react";

import axios, { AxiosError } from "axios";
import { router } from "expo-router";
import { FlatList, RefreshControl, SafeAreaView, View } from "react-native";

import LikeFilter from "@/components/mypage/LikeFilter";
import CustomHeader from "@/components/ui/CustomHeader";
import PostBlock from "@/components/ui/PostBlock";
import { UsersFavoriteUrl } from "@/constants/ApiUrls";
import { DUMMY_EVENT_POSTS } from "@/constants/DummyLike";
import useLikeRefresh from "@/hooks/useLikeRefresh";
import { useCategorySelected } from "@/stores/useCategoryStore";

export default function Like() {
  const { refresh, onRefresh } = useLikeRefresh();
  const [infodummy, setInfodummy] = useState(DUMMY_EVENT_POSTS);
  const selected = useCategorySelected();

  // TODO : api test
  useEffect(() => {
    const fetchResult = async () => {
      try {
        const params = {
          page: "0",
          limit: "10",
          // category: "FESTIVAL",
        };
        const url = `${UsersFavoriteUrl}?${new URLSearchParams(params).toString()}`;
        console.log("요청 주소 ", url); // ← 실제 주소 로그

        const response = await axios.get(UsersFavoriteUrl, { params });
        console.log("api response", response);
      } catch (e) {
        const axiosError = e as AxiosError;
        alert(`${axiosError.message}`);
      }
    };
    fetchResult();
  }, []);

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
      <FlatList
        className="w-full flex-1 px-6 py-2"
        data={
          selected === "all"
            ? infodummy
            : infodummy.filter((item) => item.category === selected)
        }
        renderItem={({ item }) => <PostBlock info={item} />}
        keyExtractor={(item) => item.id as unknown as string}
        onEndReached={() => {
          // TODO 여기에 무한 스크롤 관련 로직 추가
          console.log("여기에 무한 스크롤 관련 로직 추가");
        }}
        onEndReachedThreshold={0.8}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
}
