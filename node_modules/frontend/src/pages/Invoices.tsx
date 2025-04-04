import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Invoices: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1">
        {t('invoices.title')}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={() => alert('Add Invoice functionality coming soon!')}
      >
        {t('invoices.addButton')}
      </Button>
      <Typography variant="body1" sx={{ mt: 2 }}>
        {t('common.noData')}
      </Typography>
    </Box>
  );
};

export default Invoices;