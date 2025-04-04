import React from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Typography, TypographyProps } from '@mui/material';

interface AnimatedCounterProps extends TypographyProps {
  value: number;
  duration?: number;
  formatValue?: (value: number) => string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1,
  formatValue = (v) => v.toFixed(0),
  ...props
}) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => formatValue(latest));

  React.useEffect(() => {
    const controls = animate(count, value, { duration });
    return controls.stop;
  }, [value, count]);

  return (
    <Typography {...props}>
      <motion.span>{rounded}</motion.span>
    </Typography>
  );
};
