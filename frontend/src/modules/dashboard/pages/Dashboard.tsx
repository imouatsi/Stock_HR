import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { useTranslation } from '../../../hooks/useTranslation';
import { useAuth } from '../../../hooks/useAuth';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        {t('dashboard.welcome', { username: user?.username })}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Typography variant="h6" gutterBottom>
              {t('dashboard.quickActions')}
            </Typography>
            {/* Add quick action buttons here */}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Typography variant="h6" gutterBottom>
              {t('dashboard.recentActivity')}
            </Typography>
            {/* Add recent activity list here */}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Typography variant="h6" gutterBottom>
              {t('dashboard.notifications')}
            </Typography>
            {/* Add notifications list here */}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard; 