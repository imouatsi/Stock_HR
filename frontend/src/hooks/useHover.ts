import { useState, useCallback } from 'react';

export const useHover = (): [boolean, { onMouseEnter: () => void; onMouseLeave: () => void }] => {
  const [isHovered, setIsHovered] = useState(false);

  const onMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const onMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return [isHovered, { onMouseEnter, onMouseLeave }];
}; 