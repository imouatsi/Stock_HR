import React from 'react';
import { Box, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import { useTranslation } from '../hooks/useTranslation';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { DarkMode, LightMode } from '@mui/icons-material';
import { RootState } from '../features/store';
import { updateLanguage, toggleTheme } from '../features/slices/settingsSlice';

const languages = [
  { code: 'en', label: '🇬🇧 EN' },
  { code: 'fr', label: '🇫🇷 FR' },
  { code: 'ar', label: '🇩🇿 AR' }
];

export const LanguageThemeBar: React.FC = () => {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const { theme, language } = useSelector((state: RootState) => state.settings.settings);

  const handleLanguageChange = (_: any, newLang: string) => {
    if (newLang) {
      dispatch(updateLanguage(newLang));
      i18n.changeLanguage(newLang);
    }
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1, gap: 2 }}>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <ToggleButtonGroup
          value={language}
          exclusive
          onChange={handleLanguageChange}
          aria-label="language selector"
          size="small"
        >
          {languages.map((lang) => (
            <ToggleButton key={lang.code} value={lang.code} aria-label={lang.code}>
              {lang.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </motion.div>
      
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Tooltip title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
          <ToggleButton
            value="check"
            selected={theme === 'dark'}
            onChange={handleThemeToggle}
            aria-label="theme toggle"
            size="small"
          >
            {theme === 'dark' ? <LightMode /> : <DarkMode />}
          </ToggleButton>
        </Tooltip>
      </motion.div>
    </Box>
  );
};
