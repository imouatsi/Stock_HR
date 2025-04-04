import React from 'react';
import { Box, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
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
      document.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    }
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          right: 0,
          zIndex: 1200,
          display: 'flex',
          gap: 1,
          p: 1,
          bgcolor: 'background.paper',
          borderBottomLeftRadius: 8,
          boxShadow: 2,
        }}
      >
        <ToggleButtonGroup
          value={language}
          exclusive
          onChange={handleLanguageChange}
          size="small"
        >
          {languages.map((lang) => (
            <ToggleButton
              key={lang.code}
              value={lang.code}
              aria-label={lang.code}
              sx={{ px: 2 }}
            >
              {lang.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Tooltip title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
          <ToggleButton
            value={theme}
            selected={theme === 'dark'}
            onChange={handleThemeToggle}
            size="small"
          >
            {theme === 'light' ? <DarkMode /> : <LightMode />}
          </ToggleButton>
        </Tooltip>
      </Box>
    </motion.div>
  );
};
