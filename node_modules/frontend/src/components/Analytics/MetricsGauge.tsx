import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

interface MetricsGaugeProps {
  value: number;
  maxValue: number;
  title: string;
  color?: string;
  size?: number;
}

export const MetricsGauge: React.FC<MetricsGaugeProps> = ({
  value,
  maxValue,
  title,
  color,
  size = 200
}) => {
  const theme = useTheme();
  const percentage = (value / maxValue) * 100;
  const angle = (percentage * 270) / 100;

  return (
    <Box sx={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <motion.path
          fill="none"
          strokeWidth="20"
          stroke={theme.palette.grey[200]}
          d={`M ${size/2},${size/2} m 0,-${size/3} a ${size/3},${size/3} 0 1,1 0,${2*size/3} a ${size/3},${size/3} 0 1,1 0,-${2*size/3}`}
        />
        <motion.path
          fill="none"
          strokeWidth="20"
          strokeLinecap="round"
          stroke={color || theme.palette.primary.main}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: percentage / 100 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          d={`M ${size/2},${size/2} m 0,-${size/3} a ${size/3},${size/3} 0 1,1 0,${2*size/3} a ${size/3},${size/3} 0 1,1 0,-${2*size/3}`}
        />
      </svg>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}
      >
        <Typography variant="h4" color="primary">
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </Box>
    </Box>
  );
};
