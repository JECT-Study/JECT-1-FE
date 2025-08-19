import { Pressable, Text, View } from "react-native";

import HeartIcon from "@/components/icons/HeartIcon";
import Separator from "@/components/ui/Separator";
import useHeart from "@/hooks/useHeart";

interface infoInterface {
  img_url: string;
  title: string;
  address: string;
  start_date: string;
  end_date: string;
}

export default function PostBlock({ info }: { info: infoInterface }) {
  const { like, onPressHeart } = useHeart();

  console.log(info);

  return (
    <>
      <View className="my-[18px] flex flex-row items-center">
        {/*TODO : 실제 이미지로 교체 필요.*/}
        <View className="h-[92px] w-[92px] rounded-[4px] bg-gray-200" />
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
      </View>
      <View className="px-2">
        <Separator />
      </View>
    </>
  );
}
