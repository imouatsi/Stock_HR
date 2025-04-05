import React, { useState, useEffect } from 'react';
import { Card, Box, Typography, IconButton } from '@mui/material';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Info as InfoIcon } from '@mui/icons-material';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  percentage?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  percentage
}) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest: number) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const animation = animate(count, value, { duration: 2 });
    
    // Update the display value when the animation progresses
    const unsubscribe = rounded.on('change', (latest: number) => {
      setDisplayValue(latest);
    });
    
    return () => {
      animation.stop();
      unsubscribe();
    };
  }, [count, rounded, value]);

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card sx={{ p: 2, position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ 
            backgroundColor: `${color}22`,
            p: 1,
            borderRadius: 2,
            mr: 2
          }}>
            {icon}
          </Box>
          <Typography variant="h6">{title}</Typography>
          <IconButton sx={{ ml: 'auto' }} size="small">
            <InfoIcon />
          </IconButton>
        </Box>

        <Typography 
          variant="h3" 
          component="div" 
          sx={{ 
            fontWeight: 'bold',
            mb: 1
          }}
        >
          {displayValue}
        </Typography>

        {percentage && (
          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
            <Typography 
              variant="body2" 
              color={percentage > 0 ? 'success.main' : 'error.main'}
            >
              {percentage > 0 ? '+' : ''}{percentage}%
            </Typography>
          </Box>
        )}

        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100%',
            height: '100%',
            background: `linear-gradient(45deg, transparent, ${color}11)`,
            borderRadius: 'inherit',
          }}
        />
      </Card>
    </motion.div>
  );
};
