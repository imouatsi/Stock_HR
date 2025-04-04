import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Badge,
} from '@mui/material';
import {
  Language as LanguageIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../features/store';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'ar', name: 'العربية' },
];

const BottomBar: React.FC = () => {
  const [languageMenu, setLanguageMenu] = React.useState<null | HTMLElement>(null);
  const [currentLang, setCurrentLang] = React.useState('en');
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLanguageMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageMenu(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setLanguageMenu(null);
  };

  const handleLanguageSelect = (langCode: string) => {
    setCurrentLang(langCode);
    handleLanguageMenuClose();
    // TODO: Implement language change logic
  };

  return (
    <AppBar 
      position="fixed" 
      color="primary" 
      sx={{ 
        top: 'auto', 
        bottom: 0,
        backgroundColor: 'background.paper',
        color: 'text.primary',
        borderTop: 1,
        borderColor: 'divider'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
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
            {languages.find(lang => lang.code === currentLang)?.name}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mr: 2 }}>
            {user?.role === 'superadmin' && '👑 '}
            {user?.role === 'admin' && '⭐ '}
            {user?.firstName} {user?.lastName} ({user?.role})
          </Typography>
          <Badge badgeContent={0} color="error">
            <NotificationsIcon />
          </Badge>
        </Box>

        <Menu
          anchorEl={languageMenu}
          open={Boolean(languageMenu)}
          onClose={handleLanguageMenuClose}
        >
          {languages.map((lang) => (
            <MenuItem
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              selected={currentLang === lang.code}
            >
              {lang.name}
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default BottomBar;