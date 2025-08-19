import { useState } from "react";

export default function useHeart() {
  const [like, setLike] = useState(true);
  const onPressHeart = async () => {
    // TODO :여기에 API 관련 로직 추가해야함.
    setLike(!like);
  };
  return {
    like,
    onPressHeart,
  };
}
