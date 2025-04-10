import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { useTranslation } from '../../../hooks/useTranslation';

const NotFound: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
      }}
    >
      <Typography variant="h1" color="primary" gutterBottom>
        404
      </Typography>
      <Typography variant="h4" gutterBottom>
        {t('error.pageNotFound')}
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        {t('error.pageNotFoundMessage')}
      </Typography>
      <Button
        component={Link}
        to="/"
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
      >
        {t('common.backToHome')}
      </Button>
    </Box>
  );
};

export default NotFound;
