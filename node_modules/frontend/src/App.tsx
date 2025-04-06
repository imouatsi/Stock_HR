import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CircularProgress, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from './features/store';
import { createAppTheme } from './theme';
import Layout from './components/Layout';
import ProtectedRoute from './modules/shared/components/ProtectedRoute';
import { publicRoutes, protectedRoutes } from './modules/shared/config/routes';

const App: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { settings } = useSelector((state: RootState) => state.settings);
  const theme = createAppTheme(settings.theme);

  const renderRoutes = (routes: typeof protectedRoutes) => {
    return routes.map((route) => {
      const Component = route.component;
      return (
        <Route
          key={route.path}
          path={route.path}
          element={
            <ProtectedRoute route={route}>
              <Suspense
                fallback={
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="100vh"
                  >
                    <CircularProgress />
                  </Box>
                }
              >
                <Component />
              </Suspense>
            </ProtectedRoute>
          }
        >
          {route.children && renderRoutes(route.children)}
        </Route>
      );
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public routes */}
          {publicRoutes.map((route) => {
            const Component = route.component;
            return (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <Suspense
                    fallback={
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        minHeight="100vh"
                      >
                        <CircularProgress />
                      </Box>
                    }
                  >
                    <Component />
                  </Suspense>
                }
              />
            );
          })}

          {/* Protected routes */}
          <Route
            element={
              <ProtectedRoute
                route={{
                  path: '/',
                  component: React.lazy(() => import('./components/Layout')),
                }}
              >
                <Layout />
              </ProtectedRoute>
            }
          >
            {renderRoutes(protectedRoutes)}
          </Route>

          {/* Catch all route */}
          <Route
            path="*"
            element={
              <Navigate
                to={isAuthenticated ? '/dashboard' : '/login'}
                replace
              />
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
