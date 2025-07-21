import { useState } from "react";

import { SafeAreaView, TextInput, View } from "react-native";

import Chevron from "@/components/icons/Chevron";
import SearchIcon from "@/components/icons/SearchIcon";
import RecentSearch from "@/components/search/RecentSearch";

export default function SearchScreen() {
  const [searchText, setSearchText] = useState("");
  return (
    <SafeAreaView className="w-full flex-1 bg-white">
      <View className="flex flex-row items-center p-6">
        <Chevron direction={"left"} />
        <View className="ml-3 flex h-11 flex-1 flex-row items-center rounded-full border-[1.2px] border-[#6B51FB] p-2">
          <SearchIcon color="#6B51FB" />
          <TextInput
            className="px-4"
            placeholder="검색어를 입력해주세요."
            placeholderTextColor="#9CA3AF"
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
          />
        </View>
      </View>
      <RecentSearch textInput={searchText} setSearchText={setSearchText} />
    </SafeAreaView>
  );
}
