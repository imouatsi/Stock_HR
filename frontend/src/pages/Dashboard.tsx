import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Tooltip,
  Fade,
  Zoom,
  CircularProgress,
  Alert,
  Grow,
  Slide,
  useTheme,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  Description as DescriptionIcon,
  MoreVert as MoreVertIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from '@mui/icons-material';
import { useTranslation } from '../hooks/useTranslation';
import {
  gradientText,
  pageContainer,
  gradientBox,
} from '../theme/gradientStyles';

interface StatCard {
  id: string;
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stats: StatCard[] = [
    {
      id: 'revenue',
      title: t('dashboard.revenue'),
      value: '$124,563.00',
      change: 12.5,
      icon: <TrendingUpIcon />,
      color: '#4CAF50',
    },
    {
      id: 'users',
      title: t('dashboard.users'),
      value: 245,
      change: 8.2,
      icon: <PeopleIcon />,
      color: '#2196F3',
    },
    {
      id: 'inventory',
      title: t('dashboard.inventory'),
      value: 1234,
      change: -3.1,
      icon: <InventoryIcon />,
      color: '#FF9800',
    },
    {
      id: 'contracts',
      title: t('dashboard.contracts'),
      value: 89,
      change: 5.7,
      icon: <DescriptionIcon />,
      color: '#9C27B0',
    },
  ];

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          gap: 2
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography
          variant="h6"
          sx={{
            opacity: 0,
            animation: 'fadeInOut 1.5s infinite',
            '@keyframes fadeInOut': {
              '0%': { opacity: 0 },
              '50%': { opacity: 1 },
              '100%': { opacity: 0 },
            },
          }}
        >
          {t('common.loading')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={pageContainer}>
      <Box className="page-title">
        <Slide direction="right" in={true} mountOnEnter unmountOnExit>
          <Typography 
            variant="h4" 
            component="h1"
            sx={gradientText}
          >
            {t('dashboard.title')}
          </Typography>
        </Slide>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      )}

      <Fade in={true} timeout={1000}>
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={stat.id}>
              <Grow in={true} timeout={1000} style={{ transitionDelay: `${index * 100}ms` }}>
                <Card
                  sx={{
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: (theme) => theme.shadows[8],
                    },
                    ...gradientBox,
                    '&::before': {
                      ...gradientBox['&::before'],
                      background: `linear-gradient(45deg, ${stat.color} 30%, ${stat.color}99 90%)`,
                    },
                  }}
                >
                  <CardHeader
                    action={
                      <Tooltip title={t('common.more')} arrow TransitionComponent={Zoom}>
                        <IconButton 
                          aria-label="settings"
                          sx={{
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              transform: 'rotate(180deg)',
                            },
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Tooltip>
                    }
                    title={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            backgroundColor: `${stat.color}20`,
                            color: stat.color,
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': {
                              transform: 'scale(1.1) rotate(10deg)',
                            },
                          }}
                        >
                          {stat.icon}
                        </Box>
                        <Typography variant="h6" color="text.primary">
                          {stat.title}
                        </Typography>
                      </Box>
                    }
                  />
                  <CardContent>
                    <Typography variant="h4" sx={{ mb: 1 }}>
                      {stat.value}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          color: stat.change >= 0 ? 'success.main' : 'error.main',
                        }}
                      >
                        {stat.change >= 0 ? (
                          <ArrowUpwardIcon fontSize="small" />
                        ) : (
                          <ArrowDownwardIcon fontSize="small" />
                        )}
                        <Typography variant="body2" sx={{ ml: 0.5 }}>
                          {Math.abs(stat.change)}%
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        vs last month
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Fade>

      <Box sx={{ mt: 4 }}>
        <Fade in={true} timeout={1000}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper
                sx={{
                  p: 3,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: (theme) => theme.shadows[8],
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  },
                }}
              >
                <Typography variant="h6" gutterBottom>
                  {t('dashboard.revenueChart')}
                </Typography>
                <Box
                  sx={{
                    height: 300,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'text.secondary',
                  }}
                >
                  {t('dashboard.chartPlaceholder')}
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 3,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: (theme) => theme.shadows[8],
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: 'linear-gradient(45deg, #9C27B0 30%, #E040FB 90%)',
                  },
                }}
              >
                <Typography variant="h6" gutterBottom>
                  {t('dashboard.recentActivity')}
                </Typography>
                <Box
                  sx={{
                    height: 300,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'text.secondary',
                  }}
                >
                  {t('dashboard.activityPlaceholder')}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Fade>
      </Box>

      <style>
        {`
          @keyframes fadeInOut {
            0% { opacity: 0; }
            50% { opacity: 1; }
            100% { opacity: 0; }
          }
        `}
      </style>
    </Box>
  );
};

export default Dashboard;