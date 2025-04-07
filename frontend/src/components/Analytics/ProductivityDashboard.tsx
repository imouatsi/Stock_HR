import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  LinearProgress,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  InfoOutlined,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../features/store';
import { ResponsivePie } from '@nivo/pie';
import { motion } from 'framer-motion';
import { UserProfile } from '../../types/user';

interface AnalyticsSettings {
  workspace?: {
    analytics?: {
      kpis?: {
        performance?: {
          skillMatrix?: any;
        };
      };
      gamification?: any;
    };
  };
}

interface ExtendedUserProfile extends UserProfile {
  settings?: AnalyticsSettings;
}

export const ProductivityDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { kpis, gamification } = (user as ExtendedUserProfile)?.settings?.workspace?.analytics || {};

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{ duration: 0.5 }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Daily Progress</Typography>
              <Box>
                <Typography variant="h4" color="primary">
                  Level {gamification?.level}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(gamification?.experience || 0) % 100}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </Box>
            
            {kpis && (
              <Box mt={3}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Tasks Completed
                    </Typography>
                    <Typography variant="h4">
                      {kpis?.dailyTasks?.completed || 0}/{kpis?.dailyTasks?.total || 0}
                    </Typography>
                    {(kpis?.dailyTasks?.efficiency || 0) > 80 ? ( // Add fallback value
                      <TrendingUp color="success" />
                    ) : (
                      <TrendingDown color="error" />
                    )}
                  </Grid>
                  {/* Add more KPI displays */}
                </Grid>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Add more dashboard sections */}
      </Grid>
    </motion.div>
  );
};
