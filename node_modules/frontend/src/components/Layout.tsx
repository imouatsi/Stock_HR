import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  CssBaseline,
  Tooltip,
  Zoom,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  Description as ContractIcon,
  Receipt as InvoiceIcon,
  People as UserIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  RequestQuote as ProformaIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../features/store';
import { logout } from '../features/slices/authSlice';
import { AppDispatch } from '../features/store';
import BottomBar from './BottomBar';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', roles: ['admin', 'superadmin', 'manager', 'inventory_clerk'] },
  { text: 'Inventory', icon: <InventoryIcon />, path: '/inventory', roles: ['admin', 'superadmin', 'inventory_clerk'] },
  { text: 'Contracts', icon: <ContractIcon />, path: '/contracts', roles: ['superadmin'] }, // Restrict to superadmin
  { text: 'Invoices', icon: <InvoiceIcon />, path: '/invoices', roles: ['admin', 'superadmin', 'manager'] },
  { text: 'Proforma', icon: <ProformaIcon />, path: '/proforma', roles: ['admin', 'superadmin', 'manager'] },
  { text: 'Users', icon: <UserIcon />, path: '/users', roles: ['admin', 'superadmin'] },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings', roles: ['admin', 'superadmin'] },
];

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleLogout = async () => {
    await dispatch(logout()).unwrap();
    navigate('/login');
  };

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role || '')
  );

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Stock & HR
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {filteredMenuItems.map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => handleNavigation(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
      <Divider />
      <List>
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: 'background.default' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: 'primary.main',
        }}
      >
        <Toolbar>
          <Tooltip title="Open Menu" arrow TransitionComponent={Zoom}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Stock & HR Management System
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="body1">
            {user?.firstName} {user?.lastName}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
              },
            }}
            {...(!mobileOpen && { inert: true })} // Add inert attribute when closed
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        )}
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          mb: 8,
        }}
      >
        <Outlet />
      </Box>
      <BottomBar />
    </Box>
  );
};

export default Layout;