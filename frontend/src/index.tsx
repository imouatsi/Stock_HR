import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './features/store';
import App from './App';
import './i18n';
import './index.css';
import './styles/rtl.css';
// i18n is now handled in App.tsx with our custom provider

// Clear localStorage to force login
console.log('Clearing localStorage to force login');
localStorage.removeItem('token');
localStorage.removeItem('user');

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
