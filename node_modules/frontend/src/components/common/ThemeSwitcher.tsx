import React from 'react';
import { IconButton, useTheme } from '@mui/material';
import { WbSunny, NightsStay } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface ThemeSwitcherProps {
  onToggle: () => void;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ onToggle }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <IconButton
      onClick={onToggle}
      sx={{
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <motion.div
        animate={{
          rotate: isDark ? 360 : 0,
          scale: isDark ? [1, 1.2, 1] : 1
        }}
        transition={{ duration: 0.5 }}
      >
        {isDark ? (
          <NightsStay sx={{ color: 'primary.main' }} />
        ) : (
          <WbSunny sx={{ color: 'warning.main' }} />
        )}
      </motion.div>
    </IconButton>
  );
};
