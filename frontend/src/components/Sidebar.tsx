import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  Description as DescriptionIcon,
  Receipt as ReceiptIcon,
  Settings as SettingsIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../features/store';

interface MenuItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  roles: string[];
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    path: '/',
    icon: <DashboardIcon />,
    roles: ['admin', 'superadmin', 'user'],
  },
  {
    title: 'Users',
    path: '/users',
    icon: <PeopleIcon />,
    roles: ['admin', 'superadmin'],
  },
  {
    title: 'Inventory',
    path: '/inventory',
    icon: <InventoryIcon />,
    roles: ['admin', 'superadmin', 'user'],
  },
  {
    title: 'Contracts',
    path: '/contracts',
    icon: <DescriptionIcon />,
    roles: ['admin', 'superadmin', 'user'],
  },
  {
    title: 'Invoices',
    path: '/invoices',
    icon: <ReceiptIcon />,
    roles: ['admin', 'superadmin', 'user'],
  },
  {
    title: 'Auth Logs',
    path: '/auth-logs',
    icon: <AssessmentIcon />,
    roles: ['superadmin'],
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: <SettingsIcon />,
    roles: ['admin', 'superadmin'],
  },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.role || '')
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', mt: 2 }}>
        <Typography variant="h6" sx={{ px: 2, mb: 2 }}>
          Stock HR
        </Typography>
        <Divider />
        <List>
          {filteredMenuItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar; 