import { useCallback, useRef } from 'react';

export const useTimeout = (callback: () => void, delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const set = useCallback(() => {
    timeoutRef.current = setTimeout(callback, delay);
  }, [callback, delay]);

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const reset = useCallback(() => {
    clear();
    set();
  }, [clear, set]);

  return { set, clear, reset };
}; 