import { useEffect } from 'react';
import { useAnimation, AnimationControls } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export const useAnimateOnScroll = (): [any, AnimationControls] => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      controls.start('animate');
    }
  }, [controls, inView]);

  return [ref, controls];
};
