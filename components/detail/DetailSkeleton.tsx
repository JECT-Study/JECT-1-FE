import { StatusBar, View } from "react-native";

import Skeleton from "@/components/ui/Skeleton";

interface DetailSkeletonProps {
  imageHeight: number;
}

export default function DetailSkeleton({ imageHeight }: DetailSkeletonProps) {
  return (
    <View className="flex-1 bg-white">
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      {/* 이미지 영역 스켈레톤 */}
      <Skeleton width="100%" height={imageHeight} borderRadius={0} />

      {/* 컨텐츠 영역 */}
      <View className="mt-[-20px] rounded-t-2xl bg-white px-4 pt-6">
        {/* 제목 영역 */}
        <View className="mb-3.5">
          <Skeleton width="60%" height={28} style={{ marginBottom: 8 }} />
          <Skeleton width="40%" height={24} style={{ marginBottom: 12 }} />
          <Skeleton width="100%" height={20} style={{ marginBottom: 4 }} />
          <Skeleton width="80%" height={20} />
        </View>

        {/* 구분선 */}
        <View className="my-4 h-[1px] bg-[#F0F0F0]" />

        {/* 상세 정보 영역 */}
        <View className="my-6 flex-col gap-y-4">
          {/* 기간 */}
          <View className="flex-row items-center">
            <Skeleton width={96} height={16} style={{ marginRight: 16 }} />
            <Skeleton width="50%" height={16} />
          </View>

          {/* 주소 */}
          <View className="flex-row items-center">
            <Skeleton width={96} height={16} style={{ marginRight: 16 }} />
            <Skeleton width="60%" height={16} />
          </View>

          {/* 관람시간 */}
          <View className="flex-row items-center">
            <Skeleton width={96} height={16} style={{ marginRight: 16 }} />
            <Skeleton width="40%" height={16} />
          </View>

          {/* 전화번호 */}
          <View className="flex-row items-center">
            <Skeleton width={96} height={16} style={{ marginRight: 16 }} />
            <Skeleton width="45%" height={16} />
          </View>

          {/* 링크 */}
          <View className="flex-row items-center">
            <Skeleton width={96} height={16} style={{ marginRight: 16 }} />
            <Skeleton width={120} height={32} borderRadius={4} />
          </View>

          {/* 행사내용 */}
          <View className="flex-row">
            <Skeleton width={96} height={16} style={{ marginRight: 16 }} />
            <View className="flex-1">
              <Skeleton width="100%" height={16} style={{ marginBottom: 4 }} />
              <Skeleton width="90%" height={16} style={{ marginBottom: 4 }} />
              <Skeleton width="70%" height={16} />
            </View>
          </View>
        </View>

        {/* 구분선 */}
        <View className="my-4 h-[1px] bg-[#F0F0F0]" />

        {/* 컨텐츠 키워드 */}
        <View className="my-6">
          <Skeleton
            width={140}
            height={24}
            style={{ marginBottom: 16 }}
            borderRadius={4}
          />
          <View className="flex-row flex-wrap gap-2">
            {[80, 90, 70, 85, 75].map((width, index) => (
              <Skeleton
                key={index}
                width={width}
                height={32}
                borderRadius={6}
              />
            ))}
          </View>
        </View>

        {/* 위치 섹션 */}
        <View className="my-5">
          <Skeleton
            width={60}
            height={24}
            style={{ marginBottom: 16 }}
            borderRadius={4}
          />
          {/* 지도 영역 */}
          <Skeleton width="100%" height={200} borderRadius={8} />

          {/* 주소 */}
          <View className="my-3 flex-row items-center">
            <Skeleton width={18} height={18} style={{ marginRight: 6 }} />
            <Skeleton width="70%" height={16} />
          </View>

          {/* 길찾기 버튼 */}
          <Skeleton width="100%" height={48} borderRadius={8} />
        </View>
      </View>

      {/* 하단 고정 버튼 영역 */}
      <View className="absolute bottom-0 left-0 right-0 border-t border-[#E5E5E5] bg-white px-5 pb-12 pt-4">
        <View className="flex-row items-center justify-between gap-x-4">
          {/* 좋아요 버튼 */}
          <View className="flex-col items-center gap-y-1">
            <Skeleton width={28} height={28} borderRadius={14} />
            <Skeleton width={30} height={14} borderRadius={4} />
          </View>

          {/* 내 일정에 추가 버튼 */}
          <Skeleton width="90%" height={50} borderRadius={8} />
        </View>
      </View>
    </View>
  );
}
