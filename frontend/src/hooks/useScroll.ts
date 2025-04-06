import { useState, useEffect } from 'react';

interface ScrollPosition {
  x: number;
  y: number;
}

export const useScroll = (): ScrollPosition => {
  const [position, setPosition] = useState<ScrollPosition>({
    x: window.pageXOffset,
    y: window.pageYOffset,
  });

  useEffect(() => {
    const handleScroll = () => {
      setPosition({
        x: window.pageXOffset,
        y: window.pageYOffset,
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return position;
}; 