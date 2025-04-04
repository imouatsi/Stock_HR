import React from 'react';
import { Card, Box, Typography, IconButton } from '@mui/material';
import { motion, useSpring } from 'framer-motion';
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
  const animatedValue = useSpring(0);

  React.useEffect(() => {
    animatedValue.set(value);
  }, [value, animatedValue]);

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

        <motion.div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
          {animatedValue}
        </motion.div>

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
