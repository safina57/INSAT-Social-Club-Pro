import { useEffect, useCallback, useRef } from "react";

interface UseInfiniteScrollOptions {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  threshold?: number;
}

export const useInfiniteScroll = ({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  threshold = 100,
}: UseInfiniteScrollOptions) => {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (!sentinelRef.current) return;

    const sentinel = sentinelRef.current;
    const scrollContainer =
      sentinel.closest("[data-radix-scroll-area-viewport]") || window;

    let scrollTop: number;
    let scrollHeight: number;
    let clientHeight: number;

    if (scrollContainer === window) {
      scrollTop = window.scrollY;
      scrollHeight = document.documentElement.scrollHeight;
      clientHeight = window.innerHeight;
    } else {
      const container = scrollContainer as HTMLElement;
      scrollTop = container.scrollTop;
      scrollHeight = container.scrollHeight;
      clientHeight = container.clientHeight;
    }

    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    if (distanceFromBottom < threshold && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, threshold]);

  useEffect(() => {
    const scrollContainer =
      sentinelRef.current?.closest("[data-radix-scroll-area-viewport]") ||
      window;

    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  return { sentinelRef };
};
