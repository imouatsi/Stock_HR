import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { motion } from 'framer-motion';

export const AnimatedButton: React.FC<ButtonProps> = ({ children, ...props }) => {
  const MotionButton = motion(Button);
  
  return (
    <MotionButton
      {...props}
      component={motion.button}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}
    </MotionButton>
  );
};
