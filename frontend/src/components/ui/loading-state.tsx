import React from 'react';
import { Box, CircularProgress, Skeleton, Typography } from '@mui/material';

interface LoadingStateProps {
  type?: 'spinner' | 'skeleton';
  count?: number;
  text?: string;
  height?: number | string;
  width?: number | string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  type = 'spinner',
  count = 1,
  text = 'Loading...',
  height = 60,
  width = '100%',
}) => {
  if (type === 'skeleton') {
    return (
      <Box sx={{ width: '100%', mt: 1 }}>
        {Array(count)
          .fill(0)
          .map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              width={width}
              height={height}
              sx={{ mb: 1 }}
              animation="wave"
            />
          ))}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
      }}
    >
      <CircularProgress size={40} />
      <Typography variant="body2" sx={{ mt: 2 }}>
        {text}
      </Typography>
    </Box>
  );
}; 