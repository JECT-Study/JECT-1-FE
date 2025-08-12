import { useEffect, useState } from "react";

import { AxiosError } from "axios";

import { UsersFavoriteUrl } from "@/constants/ApiUrls";
import { authApi } from "@/features/axios/axiosInstance";

export type FavoriteItem = {
  contentId: number;
  likeId: number;
  title: string;
  image: string | null;
  address: string;
  startDate: string;
  endDate: string;
};

const getCategoryParam = (category: string) => {
  const categoryMap: Record<string, string> = {
    festival: "FESTIVAL",
    event: "EVENT",
    concert: "PERFORMANCE",
    exhibition: "EXHIBITION",
  };
  return category === "all" ? undefined : categoryMap[category];
};

export const useLike = (selectedCategory: string) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchLikes = async (
    pageNumber: number,
    isLoadMore: boolean = false,
  ) => {
    setLoading(true);
    try {
      const categoryParam = getCategoryParam(selectedCategory);
      const params: any = {
        page: pageNumber,
        limit: 10,
      };
      if (categoryParam) {
        params.category = categoryParam;
      }

      const response = await authApi.get(UsersFavoriteUrl, {
        params,
      });

      const { content, last, totalElements } = response.data.result;

      if (isLoadMore) {
        setFavorites((prev) => [...prev, ...content]);
        setPage(pageNumber);
      } else {
        setFavorites(content);
        setPage(0);
      }

      setHasMore(!last && (isLoadMore ? true : totalElements > 0));
    } catch (error) {
      const axiosError = error as AxiosError;
      console.log(axiosError);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (loading || !hasMore) return;
    await fetchLikes(page + 1, true);
  };

  useEffect(() => {
    fetchLikes(0, false);
  }, [selectedCategory]);

  return {
    favorites,
    loading,
    hasMore,
    loadMore,
    refetch: () => fetchLikes(0, false),
  };
};
