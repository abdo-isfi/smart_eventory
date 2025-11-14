import React from 'react';
import { Box, Typography } from '@mui/material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto', // Pushes footer to the bottom
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'grey.200',
        textAlign: 'center',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        &copy; {new Date().getFullYear()} Smart Inventory. All rights reserved.
      </Typography>
    </Box>
  );
}

export default Footer;
