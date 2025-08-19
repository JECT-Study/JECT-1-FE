import { router } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

import HeartIcon from "@/components/icons/HeartIcon";
import Separator from "@/components/ui/Separator";
import useHeart from "@/hooks/useHeart";

interface infoInterface {
  id: number;
  img_url: string;
  title: string;
  address: string;
  start_date: string;
  end_date: string;
}

export default function PostBlock({ info }: { info: infoInterface }) {
  const { like, onPressHeart } = useHeart();

  const handlePress = () => {
    router.push(`/detail/${info.id}`);
  };

  return (
    <>
      <Pressable
        className="my-[18px] flex flex-row items-center"
        onPress={handlePress}
      >
        <Image
          source={{
            uri: "https://mfnmcpsoimdf9o2j.public.blob.vercel-storage.com/detail-dummy.png",
          }}
          className="h-[92px] w-[92px] rounded-[10px]"
          resizeMode="cover"
        />
        <View className="ml-[18px] flex-1 justify-center">
          <Text className="text-[16px] font-semibold leading-normal text-[#111]">
            {info.title}
          </Text>
          <Text className="text-[13px] leading-[1.4] text-[#9E9E9E]">
            {info.address}
          </Text>
          <Text className="text-[13px] leading-normal text-[#6D6D6D]">
            {info.start_date} - {info.end_date}
          </Text>
        </View>
        <Pressable className="justify-center" onPress={onPressHeart}>
          <HeartIcon size={32} fill="#F14949" isFill={like} stroke="#FFA7A7" />
        </Pressable>
      </Pressable>
      <View className="px-2">
        <Separator />
      </View>
    </>
  );
}
