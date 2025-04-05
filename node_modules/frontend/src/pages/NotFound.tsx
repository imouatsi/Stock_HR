import React from 'react';
import { Box, Container, Typography, Button, Fade, Grow } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { gradientText } from '../theme/gradientStyles';
import GradientButton from '../components/ui/GradientButton';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Fade in={true} timeout={1000}>
          <Typography 
            variant="h1" 
            component="h1" 
            gutterBottom
            sx={{
              ...gradientText,
              fontSize: '8rem',
              fontWeight: 700,
            }}
          >
            404
          </Typography>
        </Fade>

        <Fade in={true} timeout={1500}>
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom
            sx={gradientText}
          >
            Page Not Found
          </Typography>
        </Fade>

        <Fade in={true} timeout={2000}>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            paragraph
            sx={{
              maxWidth: '80%',
              mb: 4,
            }}
          >
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </Typography>
        </Fade>

        <Grow in={true} timeout={2500}>
          <Box>
            <GradientButton
              onClick={() => navigate('/')}
              sx={{
                px: 4,
                py: 1.5,
              }}
            >
              Go to Homepage
            </GradientButton>
          </Box>
        </Grow>
      </Box>
    </Container>
  );
};

export default NotFound; 