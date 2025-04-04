import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Tooltip,
  Zoom,
} from '@mui/material';
import {
  People as PeopleIcon,
  Inventory as InventoryIcon,
  Description as ContractIcon,
  Receipt as InvoiceIcon,
  Add as AddIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../features/store';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const analytics = AnalyticsService.getInstance();

  React.useEffect(() => {
    const fetchData = async () => {
      const data = await analytics.getDashboardMetrics();
      const processed = await analytics.processMetrics(data);
      setMetrics(processed);
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds every 30 seconds
    return () => clearInterval(interval);al(interval);
  }, [analytics]); // Add `analytics` to the dependency array]);

  const stats = [[
    { title: 'Total Users', value: '0', icon: <PeopleIcon fontSize="large" />, color: '#1976d2' }, color: '#1976d2' },
    { title: 'Inventory Items', value: '0', icon: <InventoryIcon fontSize="large" />, color: '#2e7d32' },', icon: <InventoryIcon fontSize="large" />, color: '#2e7d32' },
    { title: 'Active Contracts', value: '0', icon: <ContractIcon fontSize="large" />, color: '#ed6c02' },le: 'Active Contracts', value: '0', icon: <ContractIcon fontSize="large" />, color: '#ed6c02' },
    { title: 'Total Invoices', value: '0', icon: <InvoiceIcon fontSize="large" />, color: '#9c27b0' },    { title: 'Total Invoices', value: '0', icon: <InvoiceIcon fontSize="large" />, color: '#9c27b0' },
  ];

  const quickActions = [
    { title: 'New Proforma', icon: <AddIcon />, action: () => navigate('/proforma') },
    { title: 'Add Inventory', icon: <InventoryIcon />, action: () => navigate('/inventory') },
    { title: 'New Contract', icon: <AssignmentIcon />, action: () => navigate('/contracts') },{ title: 'New Contract', icon: <AssignmentIcon />, action: () => navigate('/contracts') },
  ];  ];

  const recentActivities = [
    {
      title: 'New user registered',
      description: 'John Doe joined as Manager',  description: 'John Doe joined as Manager',
      time: '2 hours ago',      time: '2 hours ago',
      icon: <PeopleIcon />,
    },,
    {
      title: 'Inventory updated',
      description: 'Added 50 new items',50 new items',
      time: '3 hours ago',
      icon: <InventoryIcon />,icon: <InventoryIcon />,
    },,
    {
      title: 'Contract signed',
      description: 'Contract #123 with ABC Corp',ct #123 with ABC Corp',
      time: '5 hours ago',
      icon: <ContractIcon />,icon: <ContractIcon />,
    },,
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom><Typography variant="h4" component="h1" gutterBottom>
        Welcome back, {user?.firstName} {user?.lastName}    Welcome back, {user?.firstName} {user?.lastName}
      </Typography>      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>ography variant="subtitle1" color="text.secondary" gutterBottom>
        Here's what's happening with your business todayere's what's happening with your business today
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>er spacing={3} sx={{ mt: 2 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Tooltip title={`View details for ${stat.title}`} arrow TransitionComponent={Zoom}>p title={`View details for ${stat.title}`} arrow TransitionComponent={Zoom}>
              <Card sx={{ height: '100%', transition: 'all 0.3s ease', '&:hover': { transform: 'scale(1.05)', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.5)' } }}>        <Card sx={{ height: '100%', transition: 'all 0.3s ease', '&:hover': { transform: 'scale(1.05)', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.5)' } }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}> 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h6" component="div" color="text.secondary">
                        {stat.title}
                      </Typography>raphy>
                      <Typography variant="h4" component="div" sx={{ mt: 1 }}>
                        {stat.value}stat.value}
                      </Typography>
                    </Box>
                    <IconButton 
                      sx={{ 
                        backgroundColor: `${stat.color}15`,lor: `${stat.color}15`,
                        color: stat.color,.color,
                        p: 2, 2,
                        '&:hover': {': {
                          backgroundColor: `${stat.color}25`,ckgroundColor: `${stat.color}25`,
                        }
                      }}
                    >
                      {stat.icon}
                    </IconButton>
                  </Box>
                </CardContent>ntent>
              </Card>
            </Tooltip>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={8}>m xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Typography variant="h6" gutterBottom>
              Recent Activity              Recent Activity
            </Typography>
            <List>
              {recentActivities.map((activity, index) => (index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemIcon sx={{ color: 'primary.main' }}>ItemIcon sx={{ color: 'primary.main' }}>
                      {activity.icon}    {activity.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.title}y={activity.title}
                      secondary={
                        <React.Fragment>nt>
                          <Typography component="span" variant="body2" color="text.primary">hy component="span" variant="body2" color="text.primary">
                            {activity.description}vity.description}
                          </Typography>
                          {' — '}
                          <Typography component="span" variant="body2" color="text.secondary">mponent="span" variant="body2" color="text.secondary">
                            {activity.time}
                          </Typography>
                        </React.Fragment>t>
                      }
                    />
                  </ListItem>
                  {index < recentActivities.length - 1 && <Divider variant="inset" component="li" />}ties.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>>
          <Paper sx={{ p: 3, height: '100%' }}>sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>aphy variant="h6" gutterBottom>
              Quick Actionsk Actions
            </Typography>ypography>
            <Grid container spacing={2}>g={2}>
              {quickActions.map((action, index) => ( => (
                <Grid item xs={12} key={index}>
                  <Button
                    variant="outlined"nt="outlined"
                    fullWidth
                    startIcon={action.icon}
                    onClick={action.action}
                    sx={{ justifyContent: 'flex-start', py: 1.5 }} justifyContent: 'flex-start', py: 1.5 }}
                  >
                    {action.title}itle}
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