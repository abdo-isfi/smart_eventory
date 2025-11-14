import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

function AccessDenied() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 64px - 64px)', // Adjust for AppBar and Footer
        bgcolor: 'background.default',
        p: 3,
        textAlign: 'center',
      }}
    >
      <LockOutlinedIcon sx={{ fontSize: 100, color: 'error.main', mb: 3 }} />
      <Typography variant="h4" component="h1" color="error.main" fontWeight="bold" gutterBottom>
        Access Denied
      </Typography>
      <Typography variant="h6" component="p" color="text.secondary" mb={4}>
        You do not have the necessary permissions to view this page.
      </Typography>
      <Button
        component={RouterLink}
        to="/"
        variant="contained"
        color="primary"
        sx={{ mt: 2, py: 1.5, px: 4, fontSize: '1.1rem', fontWeight: 'bold', borderRadius: '12px' }}
      >
        Go to Home Page
      </Button>
    </Box>
  );
}

export default AccessDenied;
