import React from 'react';
import { Box, Typography, Switch, FormControlLabel } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Settings: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1">
        {t('settings.title')}
      </Typography>
      <FormControlLabel
        control={<Switch defaultChecked />}
        label={t('settings.enableNotifications')}
        sx={{ mt: 2 }}
      />
      <FormControlLabel
        control={<Switch />}
        label={t('settings.darkMode')}
        sx={{ mt: 2 }}
      />
    </Box>
  );
};

export default Settings;