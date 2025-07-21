// 최근 검색어 관련 로직이 담겨있는 컴포넌트
import { useState } from "react";

import { View, Text, ScrollView } from "react-native";

import RecentSearchListButton from "@/components/search/RecentSearchListButton";
import RecentSearchStatus from "@/components/search/RecentSearchStatus";

type Props = {
  textInput: string;
  setSearchText: (text: string) => void;
};

export default function RecentSearch({ textInput, setSearchText }: Props) {
  // TODO : 최근 검색어 가져오는 기능 구현 필요.
  const [recentSearchData, setRecentSearchData] = useState<string[]>([
    "6월 축제",
    "푸드 페스티벌",
    "고창 축제",
    "7월 축제",
    "8월 축제",
    "9월 축제",
  ]);
  // TODO : 삭제하는 경우 서버에 api 요청을 보내야함.
  const handleDelete = (keyword: string) => {
    setRecentSearchData((prev) => prev.filter((item) => item !== keyword));
  };

  if (textInput.length === 0 && recentSearchData.length > 0) {
    return (
      <View>
        <Text className="mb-5 p-6 text-[20px]">최근검색어</Text>
        {/*TODO key값은 추후 서버로 부터 오는 unique id값을 활용*/}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24 }}
          className="flex flex-row"
        >
          {recentSearchData.map((item, index) => {
            return (
              <View key={index} className="mr-2">
                <RecentSearchListButton
                  title={item}
                  onClickText={() => setSearchText(item)}
                  onClick={() => handleDelete(item)}
                />
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  } else if (textInput.length === 0 && recentSearchData.length === 0) {
    return <RecentSearchStatus type="NO_RECENT_SEARCH" />;
  } else {
    return <RecentSearchStatus type="NO_MATCH" />;
  }
}
