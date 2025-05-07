
import { useCallback, useEffect, useRef } from "react";
import { type CarouselApi } from "@/components/ui/carousel";

interface UseCarouselAutoplayProps {
  enabled?: boolean;
  interval?: number;
}

export function useCarouselAutoplay({
  enabled = true,
  interval = 5000,
}: UseCarouselAutoplayProps = {}) {
  const apiRef = useRef<CarouselApi | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoplay = useCallback(() => {
    if (!enabled) return;
    
    intervalRef.current = setInterval(() => {
      if (!apiRef.current) return;
      apiRef.current.scrollNext();
    }, interval);
  }, [enabled, interval]);

  const stopAutoplay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const setApi = useCallback((api: CarouselApi) => {
    apiRef.current = api;
    
    if (!api) return;
    
    api.on("pointerDown", stopAutoplay);
    api.on("pointerUp", startAutoplay);
  }, [startAutoplay, stopAutoplay]);

  useEffect(() => {
    startAutoplay();
    return stopAutoplay;
  }, [startAutoplay, stopAutoplay]);

  return { setApi };
}
