import React from 'react';
import { Box, Typography, Avatar, Paper } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface Activity {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  action: string;
  target: string;
  timestamp: string;
}

export const ActivityFeed: React.FC<{ activities: Activity[] }> = ({ activities }) => {
  return (
    <Box>
      <AnimatePresence>
        {activities.map((activity) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <Paper
              sx={{
                p: 2,
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                '&:hover': {
                  transform: 'translateX(10px)',
                  transition: 'transform 0.3s ease'
                }
              }}
              elevation={0}
              variant="outlined"
            >
              <Avatar src={activity.user.avatar} />
              <Box flex={1}>
                <Typography variant="body2">
                  <strong>{activity.user.name}</strong> {activity.action} <strong>{activity.target}</strong>
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {activity.timestamp}
                </Typography>
              </Box>
            </Paper>
          </motion.div>
        ))}
      </AnimatePresence>
    </Box>
  );
};
