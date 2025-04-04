import React from 'react';
import { Card, CardProps, Box } from '@mui/material';
import { motion } from 'framer-motion';

interface InteractiveCardProps extends CardProps {
  hoverEffect?: 'lift' | 'glow' | 'both';
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  hoverEffect = 'both',
  ...props
}) => {
  const getHoverStyles = () => {
    switch (hoverEffect) {
      case 'lift':
        return { y: -8 };
      case 'glow':
        return { boxShadow: '0 0 20px rgba(0,0,0,0.2)' };
      case 'both':
        return { y: -8, boxShadow: '0 0 20px rgba(0,0,0,0.2)' };
      default:
        return {};
    }
  };

  return (
    <motion.div
      whileHover={getHoverStyles()}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card {...props}>
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
          {children}
        </Box>
      </Card>
    </motion.div>
  );
};
