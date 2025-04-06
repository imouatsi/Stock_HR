import React from 'react';
import { Button, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../features/store';
import { updateLanguage } from '../features/slices/settingsSlice';
import { motion } from 'framer-motion';

const languages = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'ar', label: 'العربية', flag: '🇩🇿' },
];

export const LanguageSelector: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { settings } = useSelector((state: RootState) => state.settings);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageSelect = (langCode: 'en' | 'fr' | 'ar') => {
    dispatch(updateLanguage(langCode));
    handleClose();
    document.dir = langCode === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Button
        startIcon={<LanguageIcon />}
        onClick={handleClick}
        sx={{ textTransform: 'none' }}
      >
        {languages.find(lang => lang.code === settings.language)?.label}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleLanguageSelect(lang.code as 'en' | 'fr' | 'ar')}
            selected={settings.language === lang.code}
          >
            <ListItemIcon>{lang.flag}</ListItemIcon>
            <ListItemText>{lang.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </motion.div>
  );
};
