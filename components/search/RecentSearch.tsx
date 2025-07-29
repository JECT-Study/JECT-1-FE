import { View, Text, ScrollView, Pressable } from "react-native";

import RecentSearchListButton from "@/components/search/RecentSearchListButton";
import RecentSearchStatus from "@/components/search/RecentSearchStatus";
import useRecentSearch from "@/hooks/useRecentSearch";

type Props = {
  textInput: string;
  setSearchText: (text: string) => void;
};

export default function RecentSearch({ textInput, setSearchText }: Props) {
  const { handleDelete, handleDeleteAll, recentSearchData } = useRecentSearch();

  if (textInput.length === 0 && recentSearchData.length > 0) {
    return (
      <View>
        <View className="mb-5 flex flex-row items-center justify-between p-6">
          <Text className="text-[20px]">최근검색어</Text>
          <Pressable onPress={() => handleDeleteAll()}>
            <Text className="text-[14px] text-[#8F8F8F]">전체삭제</Text>
          </Pressable>
        </View>
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
