import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Settings: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1">
        {t('settings.title')}
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        {t('common.noData')}
      </Typography>
    </Box>
  );
};

export default Settings; 