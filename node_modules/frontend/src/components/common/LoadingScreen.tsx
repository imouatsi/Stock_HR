import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';

export const LoadingScreen: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: (theme) => 
          theme.palette.mode === 'dark' 
            ? 'rgba(0,0,0,0.9)' 
            : 'rgba(255,255,255,0.9)',
        zIndex: 9999,
      }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          duration: 0.5,
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
      >
        <CircularProgress size={60} thickness={4} />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Typography 
          variant="h6" 
          sx={{ mt: 2 }}
        >
          Loading...
        </Typography>
      </motion.div>
    </Box>
  );
};
