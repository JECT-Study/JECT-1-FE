import { useState } from "react";

import { router } from "expo-router";
import { Pressable, SafeAreaView, TextInput, View } from "react-native";

import Chevron from "@/components/icons/Chevron";
import SearchIcon from "@/components/icons/SearchIcon";
import XIcon from "@/components/icons/X";
import RecentSearch from "@/components/search/RecentSearch";

export default function SearchScreen() {
  const [searchText, setSearchText] = useState("");
  return (
    <SafeAreaView className="w-full flex-1 bg-white">
      <View className="flex flex-row items-center p-6">
        <Pressable onPress={() => router.back()}>
          <Chevron direction={"left"} />
        </Pressable>
        <View className="ml-3 flex h-11 flex-1 flex-row items-center rounded-full border-[1.2px] border-[#6B51FB] p-3">
          {searchText.length === 0 ? <SearchIcon color="#6B51FB" /> : null}
          <TextInput
            className="flex-1 px-4"
            placeholder="검색어를 입력해주세요."
            placeholderTextColor="#9CA3AF"
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
          />
          {searchText.length > 0 ? (
            <Pressable
              className="flex h-6 w-6 items-center justify-center rounded-full bg-[#8A8A8A]"
              onPress={() => {
                setSearchText("");
              }}
            >
              <XIcon size={16} color="#FFFFFF" />
            </Pressable>
          ) : null}
        </View>
      </View>
      <RecentSearch textInput={searchText} setSearchText={setSearchText} />
    </SafeAreaView>
  );
}
