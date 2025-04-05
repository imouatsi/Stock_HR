import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormControlLabel,
  Switch,
  Paper,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Fade,
  Zoom,
  useTheme,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  DarkMode as DarkModeIcon,
  Language as LanguageIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
} from '@mui/icons-material';
import { useTranslation } from '../hooks/useTranslation';
import {
  gradientText,
  pageContainer,
  gradientBox,
} from '../theme/gradientStyles';

interface SettingOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  value: boolean;
}

const Settings: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [settings, setSettings] = useState<SettingOption[]>([
    {
      id: 'notifications',
      title: t('settings.enableNotifications'),
      description: t('settings.notificationsDescription'),
      icon: <NotificationsIcon />,
      value: true,
    },
    {
      id: 'darkMode',
      title: t('settings.darkMode'),
      description: t('settings.darkModeDescription'),
      icon: <DarkModeIcon />,
      value: false,
    },
    {
      id: 'rtl',
      title: t('settings.rtlMode'),
      description: t('settings.rtlDescription'),
      icon: <LanguageIcon />,
      value: false,
    },
    {
      id: 'security',
      title: t('settings.enhancedSecurity'),
      description: t('settings.securityDescription'),
      icon: <SecurityIcon />,
      value: true,
    },
    {
      id: 'customTheme',
      title: t('settings.customTheme'),
      description: t('settings.themeDescription'),
      icon: <PaletteIcon />,
      value: false,
    },
  ]);

  const handleToggle = (id: string) => {
    setSettings(prevSettings =>
      prevSettings.map(setting =>
        setting.id === id ? { ...setting, value: !setting.value } : setting
      )
    );
  };

  return (
    <Box sx={pageContainer}>
      <Box className="page-title">
        <Typography 
          variant="h4" 
          component="h1"
          sx={gradientText}
        >
          {t('settings.title')}
        </Typography>
      </Box>

      <Fade in={true} timeout={1000}>
        <Grid container spacing={3}>
          {settings.map((setting) => (
            <Grid item xs={12} md={6} key={setting.id}>
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
                }}
              >
                <CardContent>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    mb: 2 
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <IconButton
                        sx={{
                          backgroundColor: 'primary.light',
                          color: 'primary.main',
                          '&:hover': {
                            backgroundColor: 'primary.main',
                            color: 'primary.contrastText',
                            transform: 'rotate(180deg)',
                          },
                          transition: 'all 0.3s ease-in-out',
                        }}
                      >
                        {setting.icon}
                      </IconButton>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {setting.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {setting.description}
                        </Typography>
                      </Box>
                    </Box>
                    <Tooltip 
                      title={setting.value ? t('common.enabled') : t('common.disabled')} 
                      arrow 
                      TransitionComponent={Zoom}
                    >
                      <Switch
                        checked={setting.value}
                        onChange={() => handleToggle(setting.id)}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: 'primary.main',
                            '&:hover': {
                              backgroundColor: 'primary.light',
                            },
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: 'primary.main',
                          },
                          '& .MuiSwitch-thumb': {
                            transition: 'all 0.2s ease-in-out',
                          },
                          '&:hover .MuiSwitch-thumb': {
                            transform: 'scale(1.1)',
                          },
                        }}
                      />
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Fade>
    </Box>
  );
};

export default Settings;