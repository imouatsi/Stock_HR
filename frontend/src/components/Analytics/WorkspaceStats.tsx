import React from 'react';
import { Box, Card, Typography, CircularProgress, Grid } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useSelector } from 'react-redux';
import { RootState } from '../../features/store';
import { motion } from 'framer-motion';
import { useAnimation } from 'framer-motion';

interface Feature {
  feature: string;
  useCount: number;
}

interface Stats {
  mostUsedFeatures?: Feature[];
  productivityScore: number;
}

const WorkspaceStats: React.FC<{ stats: Stats }> = ({ stats }) => {
  if (!stats) return null;

  const chartData = stats?.mostUsedFeatures?.map((feature: Feature) => ({
    name: feature.feature,
    count: feature.useCount,
  })) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">Productivity Score</Typography>
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress
                variant="determinate"
                value={stats.productivityScore}
                size={80}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {stats.productivityScore}%
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6">Feature Usage</Typography>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default WorkspaceStats;
