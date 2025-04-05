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
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  DarkMode as DarkModeIcon,
  Language as LanguageIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
} from '@mui/icons-material';
import { useTranslation } from '../hooks/useTranslation';

interface SettingOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  value: boolean;
}

const Settings: React.FC = () => {
  const { t } = useTranslation();
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
    <Box sx={{ p: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4 
      }}>
        <Typography 
          variant="h4" 
          component="h1"
          sx={{
            fontWeight: 600,
            background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
          }}
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
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: 'primary.main',
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