import { useRef } from "react";

export const useDebounce = () => {
  const timerId = useRef<number | null>(null);

  return (callback: () => void, delay: number) => {
    if (timerId.current) {
      clearTimeout(timerId.current);
      timerId.current = null;
    }
    timerId.current = setTimeout(callback, delay);
  };
};
