import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import App from './App';
import './index.css';
import './i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <App />
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: 'rgb(var(--color-charcoal-800))',
                color: 'rgb(var(--color-ivory-100))',
                border: '1px solid rgb(var(--color-charcoal-600))',
                fontSize: '14px',
              },
              success: {
                iconTheme: {
                  primary: '#c9a84c',
                  secondary: 'rgb(var(--color-charcoal-800))',
                },
              },
              error: {
                iconTheme: {
                  primary: '#b33355',
                  secondary: 'rgb(var(--color-charcoal-800))',
                },
              },
            }}
          />
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
