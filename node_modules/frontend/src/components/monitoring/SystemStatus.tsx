import React from 'react';
import { Box, Card, Typography, CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

export const SystemStatus: React.FC = () => {
  const { data: health, isLoading } = useQuery({
    queryKey: ['systemHealth'], // Correct usage
    queryFn: () => fetch('/api/system/health').then(res => res.json()),
  });

  const renderServiceStatus = (service: any) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card sx={{ p: 2, mb: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">{service.name}</Typography>
            <Box sx={{ color: service.status === 'up' ? 'success.main' : 'error.main' }}>
              {service.status === 'up' ? '🟢 Healthy' : '🔴 Down'}
            </Box>
          </Box>
          {service.metrics && (
            <Box mt={2}>
              {/* Render service-specific metrics */}
            </Box>
          )}
        </Card>
      </motion.div>
    );
  };

  // ... implementation of rendering logic
  return (
    <div>
      {/* ...existing JSX... */}
    </div>
  );
};
