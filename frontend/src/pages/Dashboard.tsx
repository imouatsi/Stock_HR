import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Divider,
  Zoom,
} from '@mui/material';
import {
  People as PeopleIcon,
  Inventory as InventoryIcon,
  Description as ContractIcon, // Add this import
  Receipt as InvoiceIcon,
  Add as AddIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../features/store';
import { useNavigate } from 'react-router-dom';
import { AnalyticsService } from '../services/AnalyticsService';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const analytics = AnalyticsService.getInstance();
  
  // Define stats with their respective keys from the data
  const [stats, setStats] = React.useState([
    { title: 'Total Users', value: '0', icon: <PeopleIcon fontSize="large" />, color: '#1976d2', key: 'total_users' },
    { title: 'Inventory Items', value: '0', icon: <InventoryIcon fontSize="large" />, color: '#2e7d32', key: 'inventory_items' },
    { title: 'Active Contracts', value: '0', icon: <ContractIcon fontSize="large" />, color: '#ed6c02', key: 'active_contracts' },
    { title: 'Total Invoices', value: '0', icon: <InvoiceIcon fontSize="large" />, color: '#9c27b0', key: 'total_invoices' },
  ]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await analytics.getDashboardMetrics();
        const processed = await analytics.processMetrics(data);
        
        // Update stats with processed data
        setStats(currentStats => 
          currentStats.map(stat => ({
            ...stat,
            value: processed.kpis[stat.key]?.toString() || '0'
          }))
        );
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [analytics]);

  const quickActions = [
    { title: 'New Proforma', icon: <AddIcon />, action: () => navigate('/proforma') },
    { title: 'Add Inventory', icon: <InventoryIcon />, action: () => navigate('/inventory') },
    { title: 'New Contract', icon: <AssignmentIcon />, action: () => navigate('/contracts') },
  ];

  const recentActivities = [
    {
      title: 'New user registered',
      description: 'John Doe joined as Manager',
      time: '2 hours ago',
      icon: <PeopleIcon />,
    },
    {
      title: 'Inventory updated',
      description: 'Added 50 new items',
      time: '3 hours ago',
      icon: <InventoryIcon />,
    },
    {
      title: 'Contract signed',
      description: 'Contract #123 with ABC Corp',
      time: '5 hours ago',
      icon: <ContractIcon />,
    },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome back, {user?.firstName} {user?.lastName}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Here's what's happening with your business today
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Tooltip title={`View details for ${stat.title}`} arrow TransitionComponent={Zoom}>
              <Card sx={{ height: '100%', transition: 'all 0.3s ease', '&:hover': { transform: 'scale(1.05)' } }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h6" component="div" color="text.secondary">
                        {stat.title}
                      </Typography>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Typography variant="h4" component="div" sx={{ mt: 1 }}>
                          {stat.value}
                        </Typography>
                      </motion.div>
                    </Box>
                    <IconButton
                      sx={{
                        backgroundColor: `${stat.color}15`,
                        color: stat.color,
                        p: 2,
                        '&:hover': {
                          backgroundColor: `${stat.color}25`,
                        }
                      }}
                    >
                      {stat.icon}
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Tooltip>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <List>
              {recentActivities.map((activity, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemIcon sx={{ color: 'primary.main' }}>
                      {activity.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.title}
                      secondary={activity.description}
                    />
                  </ListItem>
                  {index < recentActivities.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              {quickActions.map((action, index) => (
                <Grid item xs={12} key={index}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={action.icon}
                    onClick={action.action}
                    sx={{ justifyContent: 'flex-start', py: 1.5 }}
                  >
                    {action.title}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;