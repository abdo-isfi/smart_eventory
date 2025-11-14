import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

// New wrapper component to provide navigate to AuthProvider
const AuthWrapper = ({ children }) => {
  const navigate = useNavigate();
  return <AuthProvider navigate={navigate}>{children}</AuthProvider>;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthWrapper>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </AuthWrapper>
    </BrowserRouter>
  </React.StrictMode>,
);
