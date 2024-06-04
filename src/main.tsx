// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './app/store';
import './index.css';
import { ErrorProvider } from './pages/Error/ErrorContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ErrorProvider> {/* Wrap your application with ErrorProvider */}
        <Provider store={store}>
          <App />
        </Provider>
      </ErrorProvider>
    </React.StrictMode>
);
