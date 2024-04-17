import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import React from 'react';
import { AuthProvider } from 'src/context/AuthProvider.jsx';
import Loader from './components/loader';
import ThemeProvider from 'src/theme';
import { ModeProvider } from 'src/context/ModeContext';

import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <ModeProvider>
            <ThemeProvider>
              <Suspense fallback={<Loader />}>
                <App />
              </Suspense>
            </ThemeProvider>
          </ModeProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
);
