import { useCallback, useRef } from 'react';

export const useInterval = (callback: () => void, delay: number) => {
  const intervalRef = useRef<NodeJS.Timeout>();

  const set = useCallback(() => {
    intervalRef.current = setInterval(callback, delay);
  }, [callback, delay]);

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const reset = useCallback(() => {
    clear();
    set();
  }, [clear, set]);

  return { set, clear, reset };
}; 