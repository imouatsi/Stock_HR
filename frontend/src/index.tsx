import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import { store } from './features/store';
import App from './App';
import './index.css';
// i18n is now handled in App.tsx with our custom provider

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
