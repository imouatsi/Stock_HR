import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './features/store';
import { createAppTheme } from './theme/index';
import Routes from './routes';
import { LanguageProvider } from './hooks/useTranslation';
import { useSelector } from 'react-redux';
import { RootState } from './features/store';

const ThemedApp: React.FC = () => {
  const { settings } = useSelector((state: RootState) => state.settings);
  const theme = createAppTheme(settings.theme);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LanguageProvider>
        <Routes />
      </LanguageProvider>
    </ThemeProvider>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ThemedApp />
      </BrowserRouter>
    </Provider>
  );
};

export default App;
