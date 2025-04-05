import React, { useState, useEffect } from 'react';
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
  Badge,
  Menu,
  MenuItem,
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
  Language as LanguageIcon,
  Notifications as NotificationsIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../features/store';
import { logout } from '../features/auth/authSlice';
import { AppDispatch } from '../features/store';
import { updateLanguage, toggleTheme } from '../features/slices/settingsSlice';
import { useTranslation } from '../hooks/useTranslation';

const drawerWidth = 240;
const collapsedDrawerWidth = 65;

const languages = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'ar', name: 'العربية' },
];

const menuItems = [
  { text: 'dashboard', icon: <DashboardIcon />, path: '/dashboard', roles: ['admin', 'superadmin', 'manager', 'inventory_clerk'] },
  { text: 'inventory', icon: <InventoryIcon />, path: '/inventory', roles: ['admin', 'superadmin', 'inventory_clerk'] },
  { text: 'contracts', icon: <ContractIcon />, path: '/contracts', roles: ['superadmin'] },
  { text: 'invoices', icon: <InvoiceIcon />, path: '/invoices', roles: ['admin', 'superadmin', 'manager'] },
  { text: 'proforma', icon: <ProformaIcon />, path: '/proforma-invoices', roles: ['admin', 'superadmin', 'manager'] },
  { text: 'users', icon: <UserIcon />, path: '/users', roles: ['admin', 'superadmin'] },
  { text: 'settings', icon: <SettingsIcon />, path: '/settings', roles: ['admin', 'superadmin'] },
];

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [languageMenu, setLanguageMenu] = useState<null | HTMLElement>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsAnchor, setNotificationsAnchor] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { settings } = useSelector((state: RootState) => state.settings);
  const { t, i18n } = useTranslation();

  // Add fade-in effect on mount
  useEffect(() => {
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.style.opacity = '0';
      mainContent.style.transform = 'translateY(20px)';
      setTimeout(() => {
        mainContent.style.opacity = '1';
        mainContent.style.transform = 'translateY(0)';
      }, 100);
    }
  }, []);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
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

  const handleLanguageMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageMenu(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setLanguageMenu(null);
  };

  const handleLanguageSelect = (langCode: string) => {
    dispatch(updateLanguage(langCode));
    i18n.changeLanguage(langCode);
    document.dir = langCode === 'ar' ? 'rtl' : 'ltr';
    handleLanguageMenuClose();
  };

  const handleNotificationsClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchor(event.currentTarget);
    setShowNotifications(!showNotifications);
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role || '')
  );

  const drawer = (
    <div>
      <Toolbar sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: isCollapsed ? 'center' : 'space-between',
        px: isCollapsed ? 0 : 2,
        transition: theme.transitions.create(['padding'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }}>
        {!isCollapsed && (
          <Typography 
            variant="h6" 
            noWrap 
            component="div"
            sx={{
              opacity: isCollapsed ? 0 : 1,
              transition: theme.transitions.create(['opacity'], {
                duration: theme.transitions.duration.enteringScreen,
              }),
            }}
          >
            {t('common.appName')}
          </Typography>
        )}
        <IconButton 
          onClick={handleDrawerToggle}
          sx={{
            transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)',
            transition: theme.transitions.create(['transform'], {
              duration: theme.transitions.duration.shorter,
            }),
          }}
        >
          {theme.direction === 'ltr' ? (
            isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />
          ) : (
            isCollapsed ? <ChevronLeftIcon /> : <ChevronRightIcon />
          )}
        </IconButton>
      </Toolbar>
      <Divider />
      <List>
        {filteredMenuItems.map((item) => (
          <Tooltip 
            key={item.text}
            title={isCollapsed ? t(`menu.${item.text}`) : ''}
            placement="right"
            arrow
            TransitionComponent={Zoom}
          >
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              sx={{
                minHeight: 48,
                justifyContent: isCollapsed ? 'center' : 'initial',
                px: 2.5,
                transition: theme.transitions.create(['padding', 'background-color'], {
                  duration: theme.transitions.duration.standard,
                }),
                '&:hover': {
                  backgroundColor: 'action.hover',
                  transform: 'scale(1.02)',
                  transition: theme.transitions.create(['transform'], {
                    duration: theme.transitions.duration.shortest,
                  }),
                },
              }}
            >
              <ListItemIcon sx={{
                minWidth: 0,
                mr: isCollapsed ? 0 : 3,
                justifyContent: 'center',
                transition: theme.transitions.create(['margin'], {
                  duration: theme.transitions.duration.standard,
                }),
              }}>
                {item.icon}
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText 
                  primary={t(`menu.${item.text}`)}
                  sx={{
                    opacity: isCollapsed ? 0 : 1,
                    transition: theme.transitions.create(['opacity'], {
                      duration: theme.transitions.duration.standard,
                    }),
                  }}
                />
              )}
            </ListItemButton>
          </Tooltip>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: 'background.default' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { 
            sm: `calc(100% - ${isCollapsed ? collapsedDrawerWidth : drawerWidth}px)` 
          },
          ml: { 
            sm: `${isCollapsed ? collapsedDrawerWidth : drawerWidth}px` 
          },
          backgroundColor: 'primary.main',
          transition: theme.transitions.create(['width', 'margin-left'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar sx={{ 
          justifyContent: 'space-between',
          transition: theme.transitions.create(['padding'], {
            duration: theme.transitions.duration.standard,
          }),
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label={t('common.openMenu')}
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                mr: 2, 
                display: { sm: 'none' },
                '&:hover': {
                  transform: 'scale(1.1)',
                  transition: theme.transitions.create(['transform'], {
                    duration: theme.transitions.duration.shortest,
                  }),
                },
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography 
              variant="h6" 
              noWrap 
              component="div"
              sx={{
                opacity: 1,
                transform: 'translateX(0)',
                transition: theme.transitions.create(['opacity', 'transform'], {
                  duration: theme.transitions.duration.standard,
                }),
              }}
            >
              {t('common.appTitle')}
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            '& .MuiIconButton-root': {
              transition: theme.transitions.create(['transform'], {
                duration: theme.transitions.duration.shortest,
              }),
              '&:hover': {
                transform: 'scale(1.1)',
              },
            },
          }}>
            <Tooltip 
              title={t(settings.theme === 'light' ? 'common.darkMode' : 'common.lightMode')}
              arrow
              TransitionComponent={Zoom}
            >
              <IconButton
                color="inherit"
                onClick={handleThemeToggle}
                sx={{
                  animation: settings.theme === 'light' ? 'sun-rotate 10s linear infinite' : 'none',
                }}
              >
                {settings.theme === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
              </IconButton>
            </Tooltip>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                onClick={handleLanguageMenuOpen}
              >
                <LanguageIcon />
              </IconButton>
              <Typography variant="body2" sx={{ ml: 1 }}>
                {languages.find(lang => lang.code === settings.language)?.name}
              </Typography>
            </Box>

            <Typography 
              variant="body2"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              {user?.role === 'superadmin' && (
                <span style={{ 
                  animation: 'crown-bounce 2s infinite',
                  display: 'inline-block',
                }}>👑</span>
              )}
              {user?.role === 'admin' && (
                <span style={{ 
                  animation: 'star-rotate 3s infinite',
                  display: 'inline-block',
                }}>⭐</span>
              )}
              {user?.firstName} {user?.lastName} ({t(`roles.${user?.role}`)})
            </Typography>

            <IconButton
              color="inherit"
              onClick={handleNotificationsClick}
            >
              <Badge 
                badgeContent={0} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.75rem',
                    minWidth: '18px',
                    height: '18px',
                    padding: '0 4px',
                    top: 2,
                    right: 2,
                  },
                }}
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <Tooltip 
              title={t('common.logout')}
              arrow
              TransitionComponent={Zoom}
            >
              <IconButton 
                color="inherit"
                onClick={handleLogout}
                sx={{
                  '&:hover': {
                    color: 'error.light',
                  },
                }}
              >
                <LogoutIcon />
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={languageMenu}
              open={Boolean(languageMenu)}
              onClose={handleLanguageMenuClose}
              TransitionComponent={Zoom}
            >
              {languages.map((lang) => (
                <MenuItem
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code)}
                  selected={settings.language === lang.code}
                  sx={{
                    transition: theme.transitions.create(['background-color'], {
                      duration: theme.transitions.duration.shortest,
                    }),
                    '&:hover': {
                      backgroundColor: 'primary.light',
                    },
                  }}
                >
                  {lang.name}
                </MenuItem>
              ))}
            </Menu>

            <Menu
              anchorEl={notificationsAnchor}
              open={showNotifications}
              onClose={() => setShowNotifications(false)}
              TransitionComponent={Zoom}
            >
              <MenuItem sx={{ color: 'text.secondary' }}>
                {t('common.noNotifications')}
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ 
          width: { sm: isCollapsed ? collapsedDrawerWidth : drawerWidth }, 
          flexShrink: { sm: 0 } 
        }}
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
                transition: theme.transitions.create(['transform'], {
                  duration: theme.transitions.duration.enteringScreen,
                }),
              },
            }}
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
                width: isCollapsed ? collapsedDrawerWidth : drawerWidth,
                transition: theme.transitions.create(['width', 'transform'], {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                }),
                overflowX: 'hidden',
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
          width: { 
            sm: `calc(100% - ${isCollapsed ? collapsedDrawerWidth : drawerWidth}px)` 
          },
          mt: 8,
          transition: theme.transitions.create(['width', 'margin-left', 'opacity', 'transform'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Outlet />
      </Box>

      <style>
        {`
          @keyframes crown-bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
          }
          @keyframes star-rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes sun-rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </Box>
  );
};

export default Layout;