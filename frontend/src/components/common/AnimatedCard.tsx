import React from 'react';
import { Card, CardProps, Box } from '@mui/material';
import { motion } from 'framer-motion';

interface AnimatedCardProps extends CardProps {
  delay?: number;
  duration?: number;
  hover?: boolean;
  children: React.ReactNode;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  delay = 0,
  duration = 0.5,
  hover = true,
  children,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration }}
      whileHover={hover ? { scale: 1.02 } : undefined}
    >
      <Card
        {...props}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            background: 'linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.1) 100%)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
          },
          '&:hover::after': {
            opacity: 1,
          },
          ...props.sx,
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>{children}</Box>
      </Card>
    </motion.div>
  );
};
