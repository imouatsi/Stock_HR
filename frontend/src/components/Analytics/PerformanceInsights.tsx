import React from 'react';
import {
  Box,
  Card,
  Typography,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
} from '@mui/material';
import {
  TrendingUp,
  Warning,
  CheckCircle,
  Psychology,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion'; // Fix incorrect import
import { useAnimation } from 'framer-motion'; // Fix incorrect import
import { AnimatePresence } from 'framer-motion';
import { RootState } from '../../features/store';

export const PerformanceInsights: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const performance = user?.settings?.workspace?.analytics?.kpis?.performance;

  if (!performance) return null;

  const getBurnoutColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <Psychology color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6">AI Performance Insights</Typography>
      </Box>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box mb={3}>
            <Typography variant="subtitle2" gutterBottom>
              Next Month Prediction
            </Typography>
            <LinearProgress
              variant="determinate"
              value={performance?.aiPredictions?.nextMonthPerformance || 0} // Use optional chaining
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>

          <Box mb={3}>
            <Typography variant="subtitle2" gutterBottom>
              Burnout Risk
            </Typography>
            <Chip
              label={performance?.aiPredictions?.burnoutRisk || 'N/A'} // Use optional chaining
              color={getBurnoutColor(performance?.aiPredictions?.burnoutRisk || 'low')}
              icon={<Warning />}
            />
          </Box>

          <List>
            {performance.aiPredictions?.recommendedActions?.map((action, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <CheckCircle color="success" />
                </ListItemIcon>
                <ListItemText primary={action} />
              </ListItem>
            )) || <Typography>No recommendations available</Typography>} // Fallback if undefined
          </List>
        </motion.div>
      </AnimatePresence>
    </Card>
  );
};
