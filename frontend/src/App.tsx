import React, { useEffect, Suspense } from 'react';
import { useTranslation } from './hooks/useTranslation';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './contexts/AuthContext';
import MuiThemeProvider from './components/mui-theme-provider';
import AppRoutes from './routes';
// Roles are now handled in the AuthContext

const App: React.FC = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Set the dir attribute on the html element based on the language
    document.documentElement.dir = i18n.dir();
  }, [i18n]);

  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <MuiThemeProvider>
          <Suspense fallback={<div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div></div>}>
            <AppRoutes />
          </Suspense>
          <Toaster />
        </MuiThemeProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;



