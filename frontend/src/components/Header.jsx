import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Import useLocation
import { useAuth } from '../hooks/useAuth';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

function Header() {
  const { user, logout } = useAuth();
  const location = useLocation(); // Get current location

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <AppBar position="static" color="primary" elevation={3}>
      <Toolbar sx={{ justifyContent: 'space-between', flexWrap: 'wrap', py: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}>
          <Typography 
            variant="h6" 
            component={Link} 
            to="/" 
            sx={{
              flexGrow: 0,
              mr: 2,
              color: 'white',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '1.5rem',
              '&:hover': {
                color: 'rgba(255, 255, 255, 0.8)',
              },
            }}
          >
            Smart Inventory
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            {user && !isAuthPage && (
              <Button component={Link} to="/" color="inherit" sx={{ mx: 1, textTransform: 'none', fontSize: '1rem' }}>Home</Button>
            )}
            {user && (
              <>
                <Button component={Link} to="/products" color="inherit" sx={{ mx: 1, textTransform: 'none', fontSize: '1rem' }}>Products</Button>
                <Button component={Link} to="/orders" color="inherit" sx={{ mx: 1, textTransform: 'none', fontSize: '1rem' }}>Orders</Button>
              </>
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-end' }, width: { xs: '100%', md: 'auto' }, mt: { xs: 2, md: 0 } }}>
          {!user && (
            <>
              <Button component={Link} to="/login" variant="contained" sx={{ bgcolor: '#3B82F6', color: 'white', mr: 1, textTransform: 'none', px: 2, py: 1, fontSize: '1rem' }}>Login</Button>
              <Button component={Link} to="/register" variant="contained" sx={{ bgcolor: '#10B981', color: 'white', textTransform: 'none', px: 2, py: 1, fontSize: '1rem' }}>Register</Button>
            </>
          )}
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
              <Typography variant="body1" sx={{ mr: 2 }}>
                {user.email} ({user.role})
              </Typography>
              <Button onClick={logout} variant="contained" sx={{ bgcolor: '#DC3545', color: 'white', textTransform: 'none', px: 2, py: 1, fontSize: '1rem' }}>Logout</Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
