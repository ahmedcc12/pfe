import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from "@material-tailwind/react";
import { AuthProvider } from './context/AuthProvider.jsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
)
