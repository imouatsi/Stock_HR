import React from 'react';
import { IconButton, Tooltip, useTheme } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../features/store';
import { toggleTheme } from '../features/slices/settingsSlice';
import { motion } from 'framer-motion';

export const ThemeToggle: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { settings } = useSelector((state: RootState) => state.settings);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <Tooltip title={settings.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
        <IconButton 
          onClick={handleThemeToggle}
          sx={{ 
            position: 'fixed',
            bottom: 20,
            right: 20,
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[4],
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            }
          }}
        >
          {settings.theme === 'dark' ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Tooltip>
    </motion.div>
  );
};
