import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Alert,
  Fade,
  styled,
  CircularProgress,
  AppBar,
  Toolbar,
  Tooltip,
  Menu,
  MenuItem,
  Zoom,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  Language as LanguageIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
} from '@mui/icons-material';
import { useTranslation } from '../hooks/useTranslation';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/auth/authSlice';
import { AppDispatch, RootState } from '../features/store';
import { updateLanguage, toggleTheme } from '../features/slices/settingsSlice';
import GradientButton from '../components/ui/GradientButton';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 400,
  width: '100%',
  padding: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  borderRadius: 16,
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(255, 255, 255, 1)',
      boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
    },
  },
}));

const languages = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'ar', name: 'العربية' },
];

const Login: React.FC = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [languageMenu, setLanguageMenu] = useState<null | HTMLElement>(null);

  const { loading, error } = useSelector((state: RootState) => state.auth);
  const { settings } = useSelector((state: RootState) => state.settings);

  const handleLanguageMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageMenu(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setLanguageMenu(null);
  };

  const handleLanguageSelect = (langCode: string) => {
    dispatch(updateLanguage(langCode));
    i18n.changeLanguage(langCode);
    document.dir = langCode === 'ar' ? 'rtl' : 'ltr';
    handleLanguageMenuClose();
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      // Show error for missing fields
      return;
    }

    try {
      const result = await dispatch(login({ email, password })).unwrap();
      if (result.token) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ background: 'transparent', boxShadow: 'none' }}>
        <Toolbar sx={{ justifyContent: 'flex-end' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip 
              title={t(settings.theme === 'light' ? 'common.darkMode' : 'common.lightMode')}
              arrow
              TransitionComponent={Zoom}
            >
              <IconButton
                color="primary"
                onClick={handleThemeToggle}
                sx={{
                  animation: settings.theme === 'light' ? 'sun-rotate 10s linear infinite' : 'none',
                }}
              >
                {settings.theme === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
              </IconButton>
            </Tooltip>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                color="primary"
                onClick={handleLanguageMenuOpen}
              >
                <LanguageIcon />
              </IconButton>
              <Typography variant="body2" color="primary" sx={{ ml: 1 }}>
                {languages.find(lang => lang.code === settings.language)?.name}
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={languageMenu}
        open={Boolean(languageMenu)}
        onClose={handleLanguageMenuClose}
        TransitionComponent={Zoom}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleLanguageSelect(lang.code)}
            selected={settings.language === lang.code}
          >
            {lang.name}
          </MenuItem>
        ))}
      </Menu>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
          padding: 3,
        }}
      >
        <Fade in={true} timeout={1000}>
          <StyledCard>
            <CardContent>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                align="center"
                sx={{
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 4,
                }}
              >
                {t('login.title')}
              </Typography>

              <form onSubmit={handleSubmit} noValidate>
                <StyledTextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label={t('login.email')}
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!error}
                  disabled={loading}
                />

                <StyledTextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label={t('login.password')}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!error}
                  disabled={loading}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {error && (
                  <Fade in={true}>
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {error}
                    </Alert>
                  </Fade>
                )}

                <GradientButton
                  type="submit"
                  fullWidth
                  sx={{ mt: 3, mb: 2 }}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                >
                  {loading ? t('login.signingIn') : t('login.signIn')}
                </GradientButton>
              </form>
            </CardContent>
          </StyledCard>
        </Fade>
      </Box>

      <style>
        {`
          @keyframes sun-rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </Box>
  );
};

export default Login;