import React from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate
} from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { store } from './features/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import { RootState } from './features/store';
import { LanguageThemeBar } from './components/LanguageThemeBar';
import { LanguageProvider } from './hooks/useTranslation';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Layout from './components/Layout';
import Proforma from './pages/Proforma';
import Inventory from './pages/Inventory';
import Contracts from './pages/Contracts';
import Invoices from './pages/Invoices';
import Users from './pages/Users';
import Settings from './pages/Settings';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useSelector((state: RootState) => state.auth);
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  const { settings } = useSelector((state: RootState) => state.settings);

  // Create theme with current preferences
  const theme = createTheme({
    palette: {
      mode: settings.theme,
      primary: {
        main: '#90caf9',
      },
      secondary: {
        main: '#f48fb1',
      },
      background: {
        default: settings.theme === 'dark' ? '#121212' : '#f5f5f5',
        paper: settings.theme === 'dark' ? '#1e1e1e' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.5)',
            },
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          },
        },
      },
    },
    direction: settings.language === 'ar' ? 'rtl' : 'ltr',
  });

  return (
    <Provider store={store}>
      <LanguageProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <LanguageThemeBar />
            <Routes>
              {/* Redirect root path to login */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Layout with nested routes */}
              <Route path="/" element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="proforma" element={<Proforma />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="contracts" element={<Contracts />} />
                <Route path="invoices" element={<Invoices />} />
                <Route path="users" element={<Users />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* Catch all unknown routes */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Router>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={settings.language === 'ar'}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={settings.theme}
          />
        </ThemeProvider>
      </LanguageProvider>
    </Provider>
  );
}

export default App;
