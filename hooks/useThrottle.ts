import { useRef } from "react";

export const useThrottle = () => {
  const timerId = useRef<number | null>(null);

  return (callback: () => void, delay: number) => {
    if (timerId.current) return;

    timerId.current = window.setTimeout(() => {
      callback();
      timerId.current = null;
    }, delay);
  };
};
